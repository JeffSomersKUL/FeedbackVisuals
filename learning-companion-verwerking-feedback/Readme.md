# Installatie Dependencies
`pip install -r requirements.txt` or `python -m pip install -r requirements.txt` op windows

# Uitvoeren
- In de `src` map:
    - `python process.py <pathNaarMap>`
        - `<pathNaarMap>` is bv `../data/14ir`
        - Zorg dat het mapje `<pathNaarMap>` de volgende files bevat: `config.tsv`, `juisteAntwoorden.tsv` en `vragenlijsten.tsv`
            - `juisteAntwoorden.tsv` en `vragenlijsten.tsv` kunnen ook gegenereerde worden via de tex files:
                - Zorg dat de `SLEUTELreeks1.tex` file en de `IDREEKS`-files in `<pathNaarMap>` staan of de `_key` file
                - run `python generateInputFilesFromTex.py <pathNaarMap>`
        - Zorg dat `isPassingScore` in `processHelper.py` is ingevuld voor je toets (indien niet, wordt erover geklaagd door `process.py`)
        - Dit genereert data bestanden (in `<pathNaarMap>/_generated_data`) met alle nodig info om eenvoudig statistieken te kunnen berekenen.
    - `python calculateBasicStats.py <pathNaarMap>`
        - Dit script print wat standaardstatistieken over de resultaten
        - Gebruik dit om te kijken of de resultaten zouden kunnen kloppen, check zeker de statistieken per vragenlijst (enkel zichtbaar als er meerdere vragenlijsten zijn)
    - `python generateFeedbackData.py <pathNaarMap>`
        - Genereert de `.tsv` bestanden (in `<pathNaarMap>/_generated_data/_feedback_platform_data`) die nodig zijn voor het feedbackdashboard.
            - Bevatten geen ijkID's meer (behalve in de mapping file)
            - De `feedback_code_mapping.tsv` file is nodig om de juiste feedbackcodes te kunnen meesturen in de mail
                - Wordt bij tests gegenereerd
                - Als de file bestaat onder `feedback_mappings/{session}/feedbackmapping-{session}-{test}.csv` wordt die gebruikt
            - De andere files:
                - Ga naar http://feedback.ijkingstoets.be/overview
                - Vul de manage code in en klik op 'laad'
                - Upload de files bij de juiste toets
                - Klik na het uploaden op 'verwerk'

## Alternatief: Docker
- `docker-compose run verwerking process.py data/18dw qsf`


# Resultaatbestand genereren
- Zorg ervoor dat je `python process.py <path>` hebt uitgevoerd
- Zorg ervoor dat `resultaatbestand-<sessie>-<toetscode>.csv` in `<path>` staat
- Voer dan `python generateResultsFile.py <path>` uit
- Neem de file uit `<path>/_generated_data/resultaatbestand-<sessie>-<toetscode>.csv`

# Fake data maken voor een map <sessie><code>
- Zorg dat de config.tsv file juist is ingevuld in de map (vb 15wb)
- In de `src` map
- Run `python generateFAKEData.py ../15wb` (vervang de map)
- Run `python process.py ../15wb_fake qsf` (vervang de map, behoud de _fake)
- Run `python generateFeedbackData.py ../15wb_fake/` (vervang de map, behoud de _fake)
- Upload nu de files in `../<sessie><code>_fake/_generated/_feedback_platform_data` zoals hierboven beschreven

# Veralgemeende afnames
- Toetscodes beginnen met x
- xa = wb KUL
- xb = in KUL
- xc = fa KUL
- xd = bw KUL
- xe = la KUL
- xf = ww KUL
