# Idee
- Een verantwoordelijke per 'ijkingstoets'/'richting' kan het platform voor die ijkingstoets vormgeven
    - De gebruiker krijgt een specifieke code waardoor hij/zij de optie ziet om de tabs te wijzigen / er toe te voegen / te verwijderen

- De inhoud van een tab is een simpele versie van markdown:
    - Headers:
        - ```
            # H1
            ## H2
            ### H3
            #### H4
            ##### H5
            ###### H6
          ```
    - Nadruk leggen:
        - _cursief_: `_woord_`
        - **Bold**: `**woord**`
        - **Het kan ook _beide_**: `**Het kan ook _beide_**`
        - _Het kan ook zoals **dit**_: `_Het kan ook zoals **dit**_`
    - Links:
        - [Linktekst](https://www.google.com): `[Linktekst](https://www.google.com)`
    - Visualisaties:
        - Score donut: @ScoreDonut
        - Deelname-Punten flow: @DeelnamePuntenFlow
        - Punten-CSE flow: @PuntenCSEFlow
        - OefeningenMap: @OefeningenMap
        - Deelname-Advies flow: @DeelnameAdviesFlow
        - Advies-CSE flow: @AdviesCSEFlow
        - Deelname-Wiskunde flow: @DeelnameWiskundeFlow
        - Wiskunde-CSE flow: @WiskundeCSEFlow
        - Deelname-Concentratie flow: @DeelnameConcentratieFlow
        - Concentratie-CSE flow: @ConcentratieCSEFlow
        - Deelname-Motivatie flow: @DeelnameMotivatieFlow
        - Motivatie-CSE flow: @MotivatieCSEFlow
        - Deelname-Tijdsbeheer flow: @DeelnameTijdsbeheerFlow
        - Tijdsbeheer-CSE flow: @TijdsbeheerCSEFlow
    - Data: TODO uitleg
        - @data.item
    - Conditioneel: 
        - BEGIN0[als (@data.item|'tekst'|getal) 'operator' ((@data.item|'tekst'|getal)) en ...][als ...]
            content
          EINDE0
        - Getal achter begin en einde mag elk getal van 0 tot en met 9 zijn, het zorgt ervoor dat geneste if'en mogelijk zijn
        - Binnen [] kan een conditie staan van ongelijkheden/gelijkheden die tegelijk waar moeten zijn (en)
        - Meerdere [] zorgen voor een of mogelijkheid, als de 'en' conditie van één van de [] voldaan is, is de conditie voldaan
        - Ondersteunde operatoren:
            - Groter en kleiner dan: > en <
            - Groter en kleiner dan of gelijk aan: >= en <=
            - Gelijk aan: =
            - verschillend van: !=


    - Uitbreiding mogelijk naar https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#headers

- Secties automatisch niet tonen als de data niet alle gegevens bevat ?