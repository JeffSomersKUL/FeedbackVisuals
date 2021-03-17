
# Reactjs app starten

- open folder 'feedback-frontend'
- run 'npm start' in terminal
- op 'localhost:3000' is de app te zien

# Server starten

- open folder 'feedback-server'
- run 'npm start' in terminal
- de server runt op poort 9000, maar de link met de frontend is al in orde. Je moet naast het opstarten niets meer toevoegen.

# Reactjs app bewerken

In 'feedback-frontend/src/compontents/App/App.jsx' is de hoofdpagina te vinden. Tussen lijn 67 en 177 zijn de verschillende teskstjes te vinden die getoond worden aan de studenten. Aan de rest van de code moet je normaal niet meer komen.

# Keuze van oefenzittingen

In 'feedback-server/oefenzittingen/' staan alle csv-files per oefenzitting die verwerkt zijn door 'data-fetching' (**Hier moet je dus niet de excel-bestanden van de oefenzittingen plaatsen**). 

In 'routes/index.js' staat de code voor de server. Om andere oefenzittingen te tonen moet de array op lijn 11 aangepast worden. De volgorde is belangrijk (eerste entry is oefenzitting 1, tweede is oefenzitting 2, etc.). De string verwijst naar de naam van één van de csv-files in het mapje oefenzittingen. Als dit niet zo is zal de server een error geven.


