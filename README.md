# monkey-island-ape

## Installation

` npm instal`

## Todo

- Akronym für APE finden

### Workarea

Minimalstruktur einer entity

```
{
    id: INT,
    name: 'Bezeichnung der Entität', (einmalig)
    kind: z.b. :'Character' | 'Ship' | 'item',
    url: 'URL TO FANDOMWIKI',
    appearance: [
        'MM1',
        'MM2'
    ]

}, [...]

```

bestimme Kinds haben dann bestimmte weitere eigenschaften ... z.B.:

```
{
    id: INT,
    name: 'Le Chuck',
    kind:'Character',
    url: 'URL TO FANDOMWIKI'
    gender: Male,
    appearance: [
        'MM1',
        'MM2'
    ]

}, [...]

```

```
{
    id: INT,
    name: 'Shipname',
    kind:'ship',
    url: 'URL TO FANDOMWIKI'
    crew: [
        'Peter',
        'Paul',
        'Mary'
    ] ,
    appearance: [
        'MM1'
    ]

}, [...]

```

Akronyme:

Application Program Enterfacse

Application Programming Entry (im Sinne von Schiffs Zoll entry?)

Application parameter exchange

API parameter exchange

Application Programm E[...]

