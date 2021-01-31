import React from 'react';
import MarkdownParser from 'Templating/MarkdownParser';
import ReactPDF, { Page, Text, View, Document, StyleSheet, Font, Link, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40,
    },
    subtitle: {
        fontSize: 18,
        margin: 8,
        fontFamily: 'Oswald',
        marginLeft: 5
    },
    subsubtitle: {
        fontSize: 16,
        margin: 6,
        fontFamily: 'Oswald',
        marginLeft: 10
    },
    text: {
        margin: 6,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Roboto'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 'auto',
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
    table: {
        display: "table" as unknown as undefined,
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableHead: {},
    tableBody: {},
    tableRow: {
        margin: "auto",
        flexDirection: "row"
    },
    tableCol: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        marginHorizontal: 5,
        marginVertical: 5,
        fontSize: 10
    }
});

interface TableProps {
    children?: React.ReactNode
    style?: ReactPDF.Style
}

const Table = (props: TableProps) => (<View style={[styles.table, ...(props.style ? [props.style] : [])]}>{props.children}</View>);

const TableRow = (props: TableProps) => (<View style={[styles.tableRow, ...(props.style ? [props.style] : [])]}>{props.children}</View>);

const TableCol = (props: TableProps) => (<View style={[styles.tableCol, ...(props.style ? [props.style] : [])]}>{props.children}</View>);

const TableCell = (props: TableProps) => (<TableCol style={props.style}><Text style={styles.tableCell}>{props.children}</Text></TableCol>);

const TableHead = (props: TableProps) => (<View style={[styles.tableHead, ...(props.style ? [props.style] : [])]}>{props.children}</View>);

const TableBody = (props: TableProps) => (<View style={[styles.Body, ...(props.style ? [props.style] : [])]}>{props.children}</View>);

interface Props {

}

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

Font.register({
    family: 'Roboto',
    fonts: [
        {
            src: `/Roboto-Regular.ttf`
        },
        {
            src: `/Roboto-Bold.ttf`,
            fontWeight: 'bold'
        },
        {
            src: `/Roboto-Italic.ttf`,
            fontWeight: 'normal',
            fontStyle: 'italic'
        },
        {
            src: `/Roboto-BoldItalic.ttf`,
            fontWeight: 'bold',
            fontStyle: 'italic'
        }
    ]
})

export function HelpDocument(props: Props) {
    return (<Document>
            <Page style={styles.body}>
                <Text style={styles.header} fixed>
                    Handleiding
      </Text>
                <Text style={styles.title}>Feedbackdashboard ijkingstoets</Text>
                <Text style={styles.author}></Text>
                
                <Text style={styles.subtitle}>
                    Concept
                </Text>
                <Text style={styles.text}>
                    Het doel van het feedbackdashboard is om genuanceerde individuele feedback te geven aan de deelnemers van de verschillende ijkingstoetsen.
                    De deelnemer van de ijkingstoets krijgt via mail een feedbackcode waarmee hij/zij zijn/haar persoonlijke feedback kan verkrijgen.
                    De feedback zelf bestaat uit het doorlopen van een aantal stappen en hun substappen.
                </Text>
                <Image
                    style={{ ...styles.image, width: '95%' }}
                    src="/stepsExample.PNG"
                />
                <Text style={styles.text}>
                    De exacte invulling van het dashboard (stappen, substappen en de inhoud van de substappen) moet voor elke toets apart ingesteld worden.
                    De bedoeling is dat de wb toets van 2020 al gebruikmaakt van dit systeem en dat de andere toetsen (indien gewenst), vanaf 2021 ervan gebruik maken.
                </Text>
                <Text style={styles.subtitle}>
                    Beheer
                </Text>   
                <Text style={styles.text}>
                    Om de feedback voor je ijkingstoets te beheren, moet je een unique code (specifiek voor jouw toets) ingeven als 'feedbackcode'.
                    Deze code kan je bekomen bij de beheerder van het feedbackdashboard.
                    Als je de juiste code gebruikt hebt, zal je rechtsboven een helpicoontje en een tandwiel zien.
                    Via het helpicoontje wordt de laatste versie van dit document getoond en via het tandwiel wordt het beheerpaneel geopend.
                </Text>
                <Image
                    style={{...styles.image, width: 150}}
                    src="/rightUpperCorner.PNG"
                />      
                <Text style={styles.text}>
                In het beheerpaneel kunnen stappen (en substappen) worden toegevoegd en verwijderd.
                Stappen (en substappen) van plaats verwisselen, kan door ze te verslepen.
                Elk van de stappen en substappen heeft een titel die daar ook gewijzigd kan worden, net zoals de inhoud van de substappen.
                Deze inhoud kan worden geschreven in een soort 'markdown', de sectie 'Opmaak' geeft hierover meer uitleg.</Text>
                <Text style={styles.text}>
                    Om de wijzigingen lokaal toe te passen klik je op 'Toepassen'.
                    Om de wijzigingen effectief op te slaan, moet op het opslaanknopje rechtsboven geklikt worden.
                    Dit knopje is enkel zichtbaar als er effectief wijzigingen zijn.
                    Als je de pagina verlaat terwijl er nog niet-opgeslagen wijzigingen zijn, zal het platform je dit melden.
                </Text>
                <Text style={styles.text}>
                    De inhoud van substappen kan ook gewijzigd worden via het potloodicoontje op de pagina van de specifieke substap.
                    Na het wijzigen kan het resultaat dan direct bekeken worden via het previewicoontje.
                    Als je hierover tevreden bent, kan je klikken op het opslaanknopje bij de substap.
                    OPGELET: het opslaanknopje per substap zorgt er enkel voor dat het wordt toegepast (= blijft behouden bij het wisselen van substap).
                    Om de wijzigingen effectief op te slaan moet gebruik gemaakt worden van het opslaanknopje rechtsboven op de site.
                    Dit knopje is enkel zichtbaar als er een verschil is tussen de oorspronkelijke versie en de huidige versie waarop je wijzigingen hebt toegepast.
                </Text>
                <Text style={styles.text}>
                    Controleer na het opslaan of alles goed is opgeslagen door de pagina te herladen en alles na te kijken.
                                </Text>
            <Text style={styles.subtitle}>
                Opmaak
                                </Text>
            <Text style={styles.subsubtitle}>
                Titels
            </Text>
            <Text style={styles.text}>
                Een lijn die start met een opeenvolging van hekjes (#), zal een titel vormen.
                Twee hashtags betekent dat het een subtitel is van een voorgaande titel met één hashtag etc.
                Het maximaal aantal hashtags is 6.
            </Text>

            <Text style={styles.subsubtitle}>
                Nadruk leggen
            </Text>
            <Text style={styles.text}>
                Een stuk tekst cursief schrijven, kan door een underscore voor en achter het stuk tekst te schrijven (bv _dit is cursief_ : <Text style={{ fontStyle: 'italic' }}>dit is cursief</Text>).
                Een stuk tekst in het vet zetten, kan door twee sterretjes ** voor en achter het stuk tekst te schrijven (bv **dit is vet**: <Text style={{fontWeight: 'bold'}}>dit is vet</Text>).
                Cursief en vet kunnen gecombineerd worden (bv _dit is cursief **en vet**_ : <Text style={{ fontStyle: 'italic' }}>dit is cursief <Text style={{ fontWeight: 'bold' }}>en vet</Text></Text>).
            </Text>
            <Text style={styles.subsubtitle}>
                Links
            </Text>
            <Text style={styles.text}>
                Een stuk tekst met achterliggende link kan als volgt geschreven worden: [Linktekst](https://www.google.com) <Link src="https://www.google.com">Linktekst</Link>.
            </Text>
            <Text style={styles.subsubtitle}>
                Lijsten
            </Text>
            <Text style={styles.text}>
                Lijsten kunnen gemaakt worden door opeenvolgende regels te laten starten met een '-' gevolgd door een spatie en dan de tekst.
                Bijvoorbeeld:
            </Text>
            <Table style={{borderWidth: 0}}>
                <TableHead>                    
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell style={{ width: '30%', borderWidth: 0 }}>- item 1</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell style={{ width: '30%', borderWidth: 0 }}>- item 2</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Text style={styles.subsubtitle}>
                Veelvouden (dynamisch)
            </Text>
            <Text style={styles.text}>
                Soms wil je dat de keuze gemaakt wordt tussen het enkelvoud en het meervoud van een woord afhankelijk van de waarde van een variabele.
                Zo wil je schrijven: 'je had 0 vragen juist' maar ook 'je had 1 vraag juist' maar ook 'je had 2 vragen juist'.
                Dit kan je als volgt doen '&lt;&lt;&lt;3 vraag/vragen&gt;&gt;&gt;'. Het cijfer kan je ook vervangen door een variabele (zie verder): '&lt;&lt;&lt;@aantalJuist(totaal) vraag/vragen&gt;&gt;&gt; juist'
            </Text>
                <Text style={styles.subtitle}>
                    Visualisaties
                                </Text>
                <Text style={styles.text}>
                    Onderstaande commando's kunnen op een aparte regel geplaatst worden (dus geen andere tekst op de regel) om visualisaties toe te voegen.
                    Het is niet toegestaan om een visualisatie (of data-commando, zie verder) te gebruiken in een stap voor de stap die de FeedbackCode-visualisatie gebruikt.
                    De resultaten voor de student en toets kunnen pas worden opgehaald nadat een geldige feedbackcode is ingevuld.
                    Als het commando geen argumenten heeft, mogen de haakjes ook weggelaten worden.
                </Text>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{width: '30%'}}>Commando</TableCell>
                            <TableCell style={{width: '70%'}}>Beschrijving</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {MarkdownParser.supportedVisualisations().sort((v1, v2) => (v1.name > v2.name) ? 1 : -1).map((v, i: number) => <TableRow key={i}><TableCell style={{ width: '30%' }}>{`${v.name}(${Array.from(Array((v.nbArgs || 0)).keys()).map(i => `arg${i + 1}`).join(', ')})`}</TableCell><TableCell style={{ width: '70%' }}>{v.description}</TableCell></TableRow>)}
                    </TableBody>
                </Table>
                <Text style={styles.subtitle}>
                    Data
                </Text>
                <Text style={styles.text}>
                    Onderstaande commando's kunnen gebruikt worden om specifieke resultaten van de student te tonen.
                    Deze commando's kunnen (net zoals de visualisaties) pas gebruikt worden in stappen na de stap met de FeedbackCode-visualisatie.
                    Als het commando geen argumenten heeft, mogen de haakjes weggelaten worden.
                </Text>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '30%' }}>Commando</TableCell>
                            <TableCell style={{ width: '70%' }}>Beschrijving</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {MarkdownParser.supportedVariables().sort((v1, v2) => (v1.name > v2.name) ? 1 : -1).map((v, i: number) => <TableRow key={i}><TableCell style={{ width: '30%' }}>{`${v.name}(${Array.from(Array((v.nbArgs || 0)).keys()).map(i => `arg${i+1}`).join(', ')})`}</TableCell><TableCell style={{ width: '70%' }}>{v.description}</TableCell></TableRow>)}
                    </TableBody>
                </Table>
                <Text style={styles.subtitle}>
                    Conditioneel
                                </Text>
                <Text style={styles.text}>
                    Het is mogelijk om bepaalde inhoud op een pagina enkel te tonen als aan een bepaalde conditie voldaan is, bijvoorbeeld een score van minstens 15.
                </Text>
                <Text style={styles.subsubtitle}>
                    Syntax:
                </Text>
                <Text style={styles.text}>
                    {`BEGIN0[als (@data.item|'tekst'|getal) 'operator' ((@data.item|'tekst'|getal)) en ...][als ...]
                        content
                    EINDE0`}
                </Text>
                <Text style={styles.text}>
                    Het cijfer achter begin en einde mag elk cijfer van 0 tot en met 9 zijn, het zorgt ervoor dat geneste als'en mogelijk zijn (BEGIN1 binnen BEGIN0 etc).
                </Text>
                <Text style={styles.text}>
                    Binnen de vierkante haakjes [ ] kan een conditie staan van ongelijkheden/gelijkheden die tegelijk waar moeten zijn (dus een 'en'-verband).
                </Text>
                <Text style={styles.text}>
                    Meerdere [ ] zorgen voor een 'of'-verband, als de totale 'en'-conditie van één van de [ ] voldaan is, is de totale conditie voldaan.
                </Text>
                <Text style={styles.text}>
                Ondersteunde operatoren:
                </Text>
                <Text style={{...styles.text, marginLeft: 15}}>
                {`Groter en kleiner dan: > en <
                Groter en kleiner dan of gelijk aan: >= en <=
                Gelijk aan: =
                Verschillend van: !=`}
                </Text>
                <Text style={styles.text}>
                    Voorbeelden:
                    </Text>
                <Text style={{ ...styles.text, marginLeft: 15 }}>
                {`BEGIN0[als '10-14' = @scoreGroep(totaal)][als '>=14' = @scoreGroep(totaal)]
                            Je zit in de groep 10-14 of >=14
                        EINDE0`}
                </Text>
                <Text style={{ ...styles.text, marginLeft: 15 }}>
                {`BEGIN0[als 15 > @score(totaal)][als 5 < @score(totaal)]
                            De score op je ijkingstoets is kleiner dan 15 of groter dan 5
                        EINDE0`}
                </Text>
                <Text style={{ ...styles.text, marginLeft: 15 }}>
                {`BEGIN0[als 15 > @score(totaal)]
                            BEGIN1[als 5 < @score(totaal)]
                                De score op je ijkingstoets is tussen 5 en 15.
                            EINDE1
                        EINDE0`}
                </Text>
                <Text style={{ ...styles.text, marginLeft: 15 }}>
                {`BEGIN0[als 15 > @score(totaal) en 5 < @score(totaal)]
                        De score op je ijkingstoets is tussen 5 en 15.
                        EINDE0`}
                </Text>             
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
}

