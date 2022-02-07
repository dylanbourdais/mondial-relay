# apiRelay

## Description

Ce projet a pour objectif de faciliter l'utilisation de l'api de Mondial Relay avec une api qui convertit les requêtes et les réponses de Mondial Relay qui sont en XML
vers un format JSON afin de rechercher des points relais ou de créer des étiquettes.

## Prérequis pour lancer le site en local

1. Installer nodeJs
2. Lancer la commmande npm i
3. Lancer la commande npm start
4. Allez sur le lien http://localhost:1234

## Prérequis pour lancer uniquement l'api en local

1. Installer nodeJs
2. Lancer la commmande npm i
3. Lancer la commande npm run back

## Fonctionnement de l'api

Pour la recherche de points relais :  

1. POST http://127.0.0.1:3000/api/search/  
 Body: {  
    "Pays": "fr",  
    "Ville" : "rennes",  
    "CP": 35000,  
    "NombreResultats" : 1,  
    "RayonRecherche": 10  
}  

2. GET http://127.0.0.1:3000/api/search/fr/cp/35000?result=10  
3. GET http://127.0.0.1:3000/api/search/fr/ville/Rennes?rayon=100  

Pour la création d'étiquette :   

POST http://127.0.0.1:3000/api/createEtiquette/  
Body: {   
        "ModeCol": "REL",  
        "ModeLiv": "24R",  
        "Expe_Langage": "FR",  
        "Expe_Ad1": "MR",  
        "Expe_Ad3": "LA RUE",  
        "Expe_Ville": "LA VILLE",  
        "Expe_CP": "35000",  
        "Expe_Pays": "FR",  
        "Expe_Tel1": "+33230938585",  
        "Dest_Langage": "FR",  
        "Dest_Ad1": "MR",  
        "Dest_Ad3": "LA RUE",  
        "Dest_Ville": "LA VILLE",  
        "Dest_CP": "22110",  
        "Dest_Pays": "FR",  
        "Poids": 100,  
        "NbColis": 1,  
        "CRT_Valeur": 1,  
        "COL_Rel_Pays": "FR",  
        "COL_Rel": "AUTO",  
        "LIV_Rel_Pays": "FR",  
        "LIV_Rel": 4604  
    }  

## Auteurs

* Kévin Robic [![IconeGithub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kero3333) 
* Dylan Bourdais [![IconeGithub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dylanbourdais)
* Raphael Cadot [![IconeGithub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Roxas35)
* Cyril Prigent [![IconeGithub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/corsairecypri)

## Sources

- [MondialRelay](https://www.mondialrelay.fr/media/108937/Solution-Web-Service-V5.6.pdf)
