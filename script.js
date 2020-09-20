var NOTE_COEF = {
  "tap": 1.0,
  "hold": 0.5,
  "sidetap": 2.0,
  "sidehold": 1.0,
  "flick": 5.0
  };

var ATTR_COEF = {
  "firefire": 1,
  "fireleaf": 1.1,
  "fireaqua": 0.9,
  "leaffire": 0.9,
  "leafleaf": 1,
  "leafaqua": 1.1,
  "aquafire": 1.1,
  "aqualeaf": 0.9,
  "aquaaqua": 1
  }

function BScalc(){
  var notes_score = {};
  // 前後半に分けて実行
  ["first", "boss"].forEach(function(half){
    
    // カードの補正攻撃力
    var power = [1,2,3].map(function(n){
      var pow = parseFloat(document.querySelector(`input[name=pow_${half}${n}]`).value);
      var attr_coef = ATTR_COEF[getAttr(n) + getAttr()];
      var diff_coef = parseFloat(document.querySelector("select[name=difficulty]").value);
      var level_coef = 199 + parseInt(document.querySelector("input[name=boss_level]").value);
      return new BigNumber(pow).times(attr_coef).times(diff_coef).times(level_coef).toNumber();
    });


    // ノーツ毎のBS値
    ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
      var score = 0;
      var notes_num = document.querySelector(`input[name=${note}_${half}]`).value;
      var bs_notes_num = document.querySelector("input[name=bsnum_notes]").value;
      power.forEach(function(npow){
        score += Math.ceil(new BigNumber(npow).times(NOTE_COEF[note]).div(bs_notes_num).times(100).div(3).toNumber());
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

  var battlescore = 0;
  // ノーツ毎のBS値の前後半の合計
  ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
    document.querySelector(`label[name=bs_${note}]`).innerText = notes_score[note];
    battlescore += notes_score[note];
  });
  document.querySelector("span[name=bs_value]").innerText = battlescore;
}

function getAttr(n){
  if(!n)
    return document.querySelector("input[name=attr_boss]").value;
  else
    return document.querySelector(`input[name=attr_card${n}]`).value;
}

function bs_change(){
  var num = 0;
  ["first", "boss"].forEach(function(half){
    ["tap", "hold", "sidetap", "sidehold", "flick"].forEach(function(note){
      num = new BigNumber(document.querySelector(`input[name=${note}_${half}]`).value).times(NOTE_COEF[note]).plus(num);
    });
  });
  document.querySelector("input[name=bsnum_notes]").value = num.toNumber();
}

function attr_change(radio){
  console.log(radio);
  document.querySelector(`input[name=attr_${radio.name.split("_")[0]}]`).value = radio.value;
}