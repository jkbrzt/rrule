getFormValues = ($form) ->
    paramObj = {}
    $.each $form.serializeArray(), (_, kv) ->
        if paramObj.hasOwnProperty(kv.name)
            paramObj[kv.name] = $.makeArray(paramObj[kv.name])
            paramObj[kv.name].push kv.value
        else
            paramObj[kv.name] = kv.value

    paramObj


getOptionsCode = (options) ->
    days = [
        "RRule.MO"
        "RRule.TU"
        "RRule.WE"
        "RRule.TH"
        "RRule.FR"
        "RRule.SA"
        "RRule.SU"
    ]

    items = for k, v of options

        if _.contains ["dtstart", "until"], k
            console.log k, v
            v = "new Date(" + [
                v.getFullYear()
                v.getMonth()
                v.getDate()
                v.getHours()
                v.getMinutes()
                v.getSeconds()
            ].join(', ') + ")"
        else if k is "byweekday"
            console.log 'BBBB', v
            if v instanceof Array
                v = _.map v, (d)-> days[d.weekday]
            else
                v = days[v.weekday]
        else if k is "wkst"
            if v is RRule.MO
                continue
            v = days[v.weekday]

        if v instanceof Array
            v = '[' + v.join(', ') + ']'

        console.log k, ' =', v
        "#{k}: #{v}"

    "{\n  #{items.join(',\n  ')}\n}"


makeRows = (dates)->
    prevParts = []
    prevStates = []
    index = 1
    rows = for date in dates

        states = []
        parts = date.toString().split(' ')

        cells = for part, i in parts
            if part != prevParts[i]
                states[i] = not prevStates[i]
            else
                states[i] = prevStates[i]
            cls = if states[i] then 'a' else 'b'
            "<td class='#{ cls }'>#{ part }</td>"

        prevParts = parts
        prevStates = states

        "<tr><td>#{ index++ }</td>#{ cells.join('\n') }</tr>"

    rows.join('\n\n')


$ ->
    $tabs = $("#tabs")
    activateTab = ($a) ->
        id = $a.attr("href").split("#")[1]
        $tabs.find("a").removeClass "active"
        $a.addClass "active"
        $("#input-types section").hide()
        $("#input-types #" + id).show().find("input:first").focus().change()
    $("#input-types section").hide().each ->
        $("<a />",
          href: "#" + $(this).attr("id")
        ).text($(this).find("h3").hide().text()).appendTo($tabs).on "click", ->
            activateTab $(this)
            false

    $(".examples code").on "click", ->
        $code = $(this)
        $code.parents("section:first").find("input").val($code.text()).change()

    $("input, select").on "keyup change", ->
        $in = $(this)
        $section = $in.parents("section:first")
        inputMethod = $section.attr("id").split("-")[0]

        switch inputMethod
            when "text"
                makeRule = -> RRule.fromText($in.val())
                init = "RRule.fromText(\"" + @value + "\")"
            when  "rfc"
                makeRule = => RRule.fromString(@value)
                init = "RRule.fromString(\"" + @value + "\")"
            when 'options'
                values = getFormValues($in.parents("form"))
                options = {}
                getDay = (i)-> [RRule.MO, RRule.TU, RRule.WE,
                                RRule.TH, RRule.FR, RRule.SA, RRule.SU][i]
                for k, v of values
                    continue if not v
                    if _.contains ["dtstart", "until"], k
                        d = new Date(Date.parse(v))
                        v = new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000))
                    else if k is 'byweekday'
                        if v instanceof Array
                            v = _.map v, getDay
                        else
                            v = getDay v
                    else if /^by/.test(k)
                        v = _.compact(v.split(/[,\s]+/)) if not (v instanceof Array)
                        v = _.map v, (n) -> parseInt n, 10
                    else
                        v = parseInt(v, 10)

                    if k is 'wkst'
                        v = getDay v

                    if k is 'interval' and v == 1
                        continue

                    options[k] = v

                freq = options.freq
                delete options.freq

                makeRule = -> new RRule(freq, options)
                init = "new RRule(RRule." + RRule.FREQUENCIES[freq] + ", " + getOptionsCode(options) + ")"
                console.log options

        $("#init").html init
        $("#rfc-output").html ""
        $("#text-output").html ""
        $("#dates").html ""

        try
            rule = makeRule()
        catch e


        if not rule
            $("#init").append($('<pre class="error"/>').text('=> ' + String(e||null)))

        if rule
            $("#rfc-output").text rule.toString()
            $("#text-output").text rule.toText()
            max = 500
            dates = rule.all (date, i)->
                if not rule.options.count and i == max
                    return false  # That's enough

            html = makeRows dates
            if not rule.options.count
                html += """
                    <tr><td colspan='7'><em>Showing first #{max} dates, set
                    <code>count</code> to see more.</em></td></tr>
                """
            $("#dates").html html


    activateTab $tabs.find("a:first")
