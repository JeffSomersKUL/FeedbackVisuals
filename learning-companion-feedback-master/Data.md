# Inleiding
Het feedbackplatform heeft data nodig om de juiste gegevens te kunnen tonen.
Deze data wordt aangeleverd met behulp met tekstbestanden (tsv's).

Het idee van dit systeem kan samengevat worden als volgt:
- Voor elke sessie van een specifieke ijkingstoets, moeten een aantal files aangeleverd worden om feedback te kunnen geven op die sessie
- Het feedbackplatform doet zelf geen berekeningen (zoals scores etc), deze waarden moeten allemaal juist in de bestanden gestoken worden.
- Hoe de data gegenereerd en opgeslagen wordt, is van geen belang voor de feedback
- Elke toets kan zeer makkelijk beslissen of ze gebruik maken van het feedbackplatform (= bestanden aanleveren of niet)

# Input bestanden
Hieronder wordt het formaat van verschillende files besproken.

In onderstaande bestandsnamen worden volgende concepten gebruikt:
- `<sessie>`: het volgnummer van de sessie, bv 13 of 14
- `<code>`: de code van de toets bv wb, ir...

## `<sessie>-<code>-config.tsv`

### Beschrijving
   Bevat de 'configuratie' van de toets

### Kolommen
| Naam | Beschrijving |
| ------ | ---------------------- |
| key | een key |
| value | de bijhorende waarde |

### Rijen

#### Keys
| naam | beschrijving | voorbeeld | verplicht |
| :---------------------------- | :--------------------------------------------------------- | :-------------------------------- | :------- |
| toetsCode | de code van de toets | `wb` | |
| toetsSessie | het volgnummer van de sessie | `13` | |
| aantalVragen | het totaal aantal gestelde vragen | `40` | Ja |
| subScores | lijst van (sub)scores waarvoor punten beschikbaar zijn gescheiden door `|` characters | `totaal|wiskunde|chemie|basisvaardigheden` | Ja |
| `<subscore-naam>-maxScore` | de maximale score die behaalt kan worden op de subscore met naam `<subscore-naam>` | key: `totaal-maxScore`, value: `20` | Voor elke (sub)score |
| `<subscore-naam>-vragen` | lijst van `vraag-id`'s van de vragen die horen bij de (sub)score met naam `<subscore-naam>` gescheiden door `|` characters | key: `totaal-vragen`, value: `1|2|3|4|5|6|7|8|9|10|...` |  |

## `<sessie>-<code>-scores.tsv`

### Beschrijving
Bevat de scores op de toets per feedbackCode

### Kolommen
| Naam | Beschrijving | 
| ------------------------- | ------------------------------------------------------- |
| feedbackCode | de feedbackCode |
| `<subscore-naam>Juist` | het aantal juiste antwoorden op vragen van de (sub)score |
| `<subscore-naam>Fout` | het aatal foute antwoorden op vragen van de (sub)score |
| `<subscore-naam>Blanco` | het aantal blanco antwoorden op vragen van de (sub)score |
| `<subscore-naam>Score` | de behaalde score op de (sub)score |
| `<subscore-naam>Groep` | de groep waartoe de student behoort volgens zijn/haar resultaat op deze (sub)score |
| geslaagd | 1 indien geslaagd, 0 indien niet geslaagd |
| vragenReeks | de vragenReeks die de student gekregen heeft |

### Rijen
Een rij vool elke deelnemer die de toets heeft afgelegd
De `Juist`, `Fout` en `Blanco` kolommen zijn niet verplicht, maar als een subscore een `Juist`, `Fout` of `Blanco` kolom heeft, moet het ze alle drie hebben.

## `<sessie>-<code>-vragenlijsten`

### Beschrijving
De mapping tussen `vraagId`s en de volgnummers bij de verschillende vragenlijsten

### Kolommen
| Naam | Beschrijving | 
| ------------------ | ------------------------------------------------------ |
| vragenReeks | het nummer van de vragenreeks |
| `vraag<vraag-id>` | de positie in de vragenlijst van de vraag met id `vraag-id`, `vraag-id`'s starten bij 1 |

### Rijen
Een rij voor elke vragenlijst (inclusief vragenlijst 1)
TIP: vaak zal je bij vragenlijst 1 willen dat de waarde van de `vraag<vraag-id>` kolom gelijk is aan `vraag-id` zodat de vraag met id x de x'ste vraag is in vragenlijst 1

## `<sessie>-<code>-antwoorden.tsv`

### Beschrijving
De antwoorden gegeven door de student
    TODO: is het verplicht ze er allemaal in te zetten ? MOMENTEEL WEL

### Kolommen
| Naam | Beschrijving | 
| ----------------- | ------------------------------------------------- |
| feedbackCode | de feedbackCode |
| `vraag<vraag-id>` | het gegeven antwoord op vraag met id `<vraag-id>`: `A`, `B`, `C`, `D`, `E` of `X` |
OPGELET: deze file gebruikt `vraag-id`'s, geen volgnummers. Zorg er dus voor dat voor elke vragenreeks, de mapping juist gebeurt.

### Rijen
Een rij voor elke deelnemer die de toets heeft afgelegd

## `<sessie>-<code>-vraagAntwoorden`

### Beschrijving
Overzicht van de gegeven antwoorden per vraag

### Kolommen
| Naam | Beschrijving | 
| --------------------------- | -------------------------------------------------------- |
| vraagId | het id van de vraag |
| juisteAntwoord | het juiste antwoord: `A`, `B`, `C`, `D` of `E` |
| aantalAntwoorden | het totaal aantal antwoorden op de vraag (zal (meestal) hetzelfde zijn voor elke vraag)
| aantalJuist | het aantal personen met het juiste antwoord |
| aantalBlanco | het aantal met een blanco antwoord |
| percentageJuist | het percentage juiste antwoorden |
| percentageBlanco | het percentage blaco antwoorden |
| aantal`<antwoord-optie>` | het aantal personen dat `antwoord-optie` als antwoord gegeven hebben (bv `aantalA`) | 

### Rijen
Een rij voor elke vraag

## `<sessie>-<code>-peerScores`

### Beschrijving
Bevat de verdeling van de studenten in groepen volgens de (sub)scores

### Kolommen
| Naam | Beschrijving | 
| -------------- | ----------------------------------------------- |
| scoreNaam | de naam van de score |
| groepLabel | het label voor de groep |
| kleur | de kleur als rbg string: `"rgb(255,0,0)"` voor rood |
| aantal | het aantal personen in deze groep |

### Rijen
Een rij voor elke groep van de groepen voor elke (sub)score

## `<sessie>-<code>-cseScores`

### Beschrijving
Bevat data over de CSE stromen per groep volgens de (sub)scores

### Kolommen
| Naam | Beschrijving | 
| ------------------ | ---------------------------------------------- |
| scoreNaam | de naam van de score |
| scoreGroepLabel | het label voor de scoregroep |
| scoreGroepKleur | de kleur overeenkomstig me de scoregroep |
| cseGroepLabel | het label voor de CSEgroep |
| cseGroepKleur | de kleur overeenkomstig met de CSEgroep |
| percentage | het percentage van de studenten die in de scoregroep zitten, die in de CSEgroep belanden |

### Rijen
Een rij voor elke combinatie van (sub)score, scoregroep en CSEgroep

## Vragen beschikbaar maken
Als je wilt dat de vragen beschikbaar zijn in het feedbackplatform, neem dan een screenshot (bv via het knipprogramma van windows) van elke opgave apart en sla deze bestanden op als `<sessie>-<code>-question-<vraagId>.png`
 