# Les Petits plats

![Logo](https://raw.githubusercontent.com/maxew33/petits-plats/main/asset/img/logo.png)

## Compétences cibles

- Analyser un problème informatique
- Développer un algorithme pour résoudre ce problème

## Objectif

Implémenter un algorithme de recherche de recettes de cuisine pour le site "Les Petits Plats" grâce à des outils et méthodes avancées de Javascript.

## Besoin

Recherche de recettes de cuisine avec options multiples :

* par un champ de recherche global
* par ingrédients
* par appareils
* par ustensiles

## Ressources

* [Maquettes](https://www.figma.com/file/xqeE1ZKlHUWi2Efo8r73NK)
* [Fiche d'investigation](https://github.com/maxew33/petits-plats/blob/binarySort/fiche%20investigation.pdf)

## Demo

**[Petits Plats](https://maxew33.github.io/petits-plats/)**


## Tests

### jsben.ch

[50 recettes](https://jsben.ch/st8sB) / [60 recettes](https://jsben.ch/U2ICL)

### résultats des tests

* mot recherché : "coco" (mot qui apparait dans des titres, ingrédients et ustensiles)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 58.65% |
| 50 | **100%** | 79.77% |
| 60 | **100%** | 84.16% |


* mot recherché : "cho" (mot qui apparait dans des titres, ingrédients et description)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 52.53% |
| 50 | **100%** | 57.92% |
| 60 | **100%** | 77.46% |


* mot recherché : "coquille" (mot qui n'apparait que dans la description d'une seule recette)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 56.88% |
| 50 | **100%** | 71.53% |
| 60 | 84.64% | **100%** |


* mot recherché : "limonade de coco" (nom d'une seule recette)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 55.95% |
| 50 | **100%** | 90.36% |
| 60 | 74.04% | **100%** |


* mot recherché : "fenouil" (mot qui n'apparait pas)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 54.79% |
| 50 | **100%** | 79.61% |
| 60 | 90.35% | **100%** |


* mot recherché : "une" (mot qui apparait le plus souvent)

| nb recettes | bubble sort  | binary sort |
| :---: | :----: | :---: |
| 25 | **100%** | 56.10% |
| 50 | **100%** | 80.33% |
| 60 | 95.26% | **100%** |



## Author

- [Maxime Malfilâtre](https://www.github.com/maxew33)

