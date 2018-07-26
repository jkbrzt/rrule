import RRule from '../src/index'

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const getFormValues = function($form) {
  const paramObj = {};
  $.each($form.serializeArray(), function(_, kv) {
      if (paramObj.hasOwnProperty(kv.name)) {
          paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
          return paramObj[kv.name].push(kv.value);
      } else {
          return paramObj[kv.name] = kv.value;
      }
  });

  return paramObj;
};


const getOptionsCode = function(options) {
  const days = [
      "RRule.MO",
      "RRule.TU",
      "RRule.WE",
      "RRule.TH",
      "RRule.FR",
      "RRule.SA",
      "RRule.SU"
  ];

  const items = (() => {
      const result = [];
      for (let k in options) {
          let v = options[k];
          if (v === null) {
              v = 'null';
          } else if (k === 'freq') {
              v = `RRule.${RRule.FREQUENCIES[v]}`;
          } else if (["dtstart", "until"].includes(k)) {
              v = "new Date(" + [
                  v.getFullYear(),
                  v.getMonth(),
                  v.getDate(),
                  v.getHours(),
                  v.getMinutes(),
                  v.getSeconds()
              ].join(', ') + ")";
          } else if (k === "byweekday") {
              if (v instanceof Array) {
                  v = v.map(function(wday){
                      console.log('wday', wday);
                      let s = days[wday.weekday];
                      if (wday.n) {
                          s+= `.nth(${wday.n})`;
                      }
                      return s;
                  });
              } else {
                  v = days[v.weekday];
              }
          } else if (k === "wkst") {
              if (v === RRule.MO) {
                  continue;
              }
              v = days[v.weekday];
          }

          if (v instanceof Array) {
              v = `[${v.join(', ')}]`;
          }

          console.log(k, ' =', v);
          result.push(`${k}: ${v}`);
      }
      return result;
  })();

  return `{\n  ${items.join(',\n  ')}\n}`;
};


const makeRows = function(dates){
  let prevParts, prevStates;
  prevParts = [];
  prevStates = [];
  let index = 1;
  const rows = (() => {
      const result = [];
      for (let date of dates) {

          var states = [];
          var parts = date.toString().split(' ');

          const cells = (() => {
              const result1 = [];
              for (let i = 0; i < parts.length; i++) {
                  const part = parts[i];
                  if (part !== prevParts[i]) {
                      states[i] = !prevStates[i];
                  } else {
                      states[i] = prevStates[i];
                  }
                  const cls = states[i] ? 'a' : 'b';
                  result1.push(`<td class='${ cls }'>${ part }</td>`);
              }
              return result1;
          })();

          prevParts = parts;
          prevStates = states;

          result.push(`<tr><td>${ index++ }</td>${ cells.join('\n') }</tr>`);
      }
      return result;
  })();

  return rows.join('\n\n');
};


$(function() {
  const $tabs = $("#tabs");

  const activateTab = function($a) {
      const id = $a.attr("href").split("#")[1];
      $tabs.find("a").removeClass("active");
      $a.addClass("active");
      $("#input-types section").hide();
      return $(`#input-types #${id}`).show().find("input:first").focus().change();
  };


  $("#input-types section").hide().each(function() {
      return $("<a />",
        {href: `#${$(this).attr("id")}`}
      ).text($(this).find("h3").hide().text()).appendTo($tabs).on("click", function() {
          activateTab($(this));
          return false;
      });
  });

  $(".examples code").on("click", function() {
      const $code = $(this);
      return $code.parents("section:first").find("input").val($code.text()).change();
  });

  $("input, select").on('keyup change', function() {
      let init, makeRule, options, rule;
      const $in = $(this);
      const $section = $in.parents("section:first");
      const inputMethod = $section.attr("id").split("-")[0];

      switch (inputMethod) {
          case "text":
              makeRule = () => RRule.fromText($in.val());
              init = `RRule.fromText("${this.value}")`;
              break;
          case "rfc":
              makeRule = () => RRule.fromString(this.value);
              init = `RRule.fromString("${this.value}")`;
              break;
          case 'options':
              var values = getFormValues($in.parents("form"));
              options = {};
              var days = [
                  RRule.MO,
                  RRule.TU,
                  RRule.WE,
                  RRule.TH,
                  RRule.FR,
                  RRule.SA,
                  RRule.SU
              ];
              var getDay = i=> days[i];

              for (let key in values) {

                  let value = values[key];
                  if (!value) {
                      continue;
                  } else if (['dtstart', 'until'].includes(key)) {
                      const date = new Date(Date.parse(value));
                      value = new Date(date.getTime() + (date.getTimezoneOffset() * 60 * 1000));
                  } else if (key === 'byweekday') {
                      if (value instanceof Array) {
                          value = value.map(getDay);
                      } else {
                          value = getDay(value);
                      }
                  } else if (/^by/.test(key)) {
                      if (!(value instanceof Array)) {
                          value = value.split(/[,\s]+/);
                      }
                      value = (value.filter((v) => v));
                      value = value.map(n => parseInt(n, 10));
                  } else {
                      value = parseInt(value, 10);
                  }

                  if (key === 'wkst') {
                      value = getDay(value);
                  }

                  if ((key === 'interval') && ((value === 1) || !value)) {
                      continue;
                  }

                  options[key] = value;
              }

              makeRule = () => new RRule(options);
              init = `new RRule(${getOptionsCode(options)})`;
              console.log(options);
              break;
      }

      $("#init").html(init);
      $("#rfc-output a").html("");
      $("#text-output a").html("");
      $("#options-output").html("");
      $("#dates").html("");

      try {
          rule = makeRule();
      } catch (e) {
          $("#init").append($('<pre class="error"/>').text(`=> ${String(e||null)}`));
          return;
      }

      const rfc = rule.toString();
      const text = rule.toText();
      $("#rfc-output a").text(rfc).attr('href', `#/rfc/${rfc}`);
      $("#text-output a").text(text).attr('href', `#/text/${text}`);
      $("#options-output").text(getOptionsCode(rule.origOptions));
      if (inputMethod === 'options') {
          $("#options-output").parents('tr').hide();
      } else {
          $("#options-output").parents('tr').show();
      }
      const max = 500;
      const dates = rule.all(function(date, i){
          if (!rule.options.count && (i === max)) {
              return false;  // That's enough
          }
          return true;
      });

      let html = makeRows(dates);
      if (!rule.options.count) {
          html += `\
<tr><td colspan='7'><em>Showing first ${max} dates, set
<code>count</code> to see more.</em></td></tr>\
`;
      }
      return $("#dates").html(html);
  });

  activateTab($tabs.find("a:first"));

  const processHash = function() {
      const hash = location.hash.substring(1);
      if (hash) {
          const match = /^\/(rfc|text)\/(.+)$/.exec(hash);
          if (match) {
              const method = match[1];  // rfc | text
              const arg = match[2];
              activateTab($(`a[href='#${method}-input']`));
              return $(`#${method}-input input:first`).val(arg).change();
          }
      }
  };
  processHash();
  return $(window).on('hashchange', processHash);
});
