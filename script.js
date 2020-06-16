function BScalc(){
  var notes_score = {};
  // 前後半に分けて実行
  ["first", "boss"].forEach(function(half){
    
    // カードの補正攻撃力
    var power = [1,2,3].map(function(n){
      var pow = parseFloat(document.querySelector(`input[name=pow_${half}${n}]`).value);
      var attr_coef = getAttrCoef(getAttr(n), getAttr());
      var diff_coef = parseFloat(document.querySelector("select[name=difficulty]").value);
      var level_coef = 199 + parseInt(document.querySelector("input[name=boss_level]").value);
      return pow * attr_coef * diff_coef * level_coef;
    });


    // ノーツ毎のBS値
    ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
      var score = 0;
      var notes_num = parseFloat(document.querySelector(`input[name=${note}_${half}]`).value);
      var bs_notes_num = parseFloat(document.querySelector("input[name=bsnum_notes]").value);
      power.forEach(function(npow){
        score += Math.ceil(npow * getNoteCoef(note) / bs_notes_num * 100 / 3);
      });
      document.querySelector(`label[name=unibs_${note}_${half}]`).innerText = score;
      document.querySelector(`label[name=bs_${note}_${half}]`).innerText = score * notes_num;
      if(!notes_score[note]) notes_score[note] = score * notes_num;
      else notes_score[note] += score * notes_num;

      console.log(half, note, score, notes_num, bs_notes_num);
    });

    console.log(half, power);
  });
  console.log(notes_score);

  var score = 0;
  // ノーツ毎のBS値の前後半の合計
  ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
    document.querySelector(`label[name=bs_${note}]`).innerText = notes_score[note];
    score += notes_score[note];
  });
  document.querySelector("span[name=bs_value]").innerText = score;
}

function getAttr(n){
  if(!n) n="";
  var attr;
  ["fire", "leaf", "aqua"].forEach(function(a){
    if(document.querySelector(`input[id=attr_${a}${n}]`).checked){
      attr = a;
    }
  });
  return attr;
}

function getAttrCoef(user_attr, enemy_attr){
  var coef;
  switch(user_attr + enemy_attr){
    case "firefire": coef = 1; break;
    case "fireleaf": coef = 1.1; break;
    case "fireaqua": coef = 0.9; break;
    case "leaffire": coef = 0.9; break;
    case "leafleaf": coef = 1; break;
    case "leafaqua": coef = 1.1; break;
    case "aquafire": coef = 1.1; break;
    case "aqualeaf": coef = 0.9; break;
    case "aquaaqua": coef = 1; break;
  }
  return coef;
}

function bs_change(input){
  var num = 0;
  ["first", "boss"].forEach(function(half){
    ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
      num += parseFloat(document.querySelector(`input[name=${note}_${half}]`).value * getNoteCoef(note));
    });
  });
  document.querySelector("input[name=bsnum_notes]").value = num;
}

function getNoteCoef(note_name){
  var result;
  switch(note_name){
    case "tap": result = 1; break;
    case "hold": result = 0.5; break;
    case "sidetap": result = 2; break;
    case "sidehold": result = 1; break;
    case "flick": result = 5; break;
  }
  return result;
}