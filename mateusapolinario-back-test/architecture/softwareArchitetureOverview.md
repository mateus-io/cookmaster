# Vis茫o geral da Arquitetura da API 馃殌:

![Vis茫o geral da Arquitetura da API](../public/softwareArchitectureOverview.png)

## `M贸dulo:`
#### Constru铆 a arquitetura baseada em `m贸dulos`, onde cada `m贸dulo` 茅 basicamente um agrupamento de requisitos ou hist贸rias de usu谩rio que dizem respeito 脿 uma entidade.

#### `Repository Pattern`
> Alguns m贸dulos possuem uma camada que encapsula a l贸gica de acesso aos recursos do banco, esta camada possui m茅todos gen茅ricos para acesso ao banco (findOne, insertOne...).

![Repository de um m贸dulo](../public/repository.png)

### Exemplo do m贸dulo `User`:

![Imagem de exemplo do m贸dulo User](../public/userModule.png)
![Imagem de exemplo do m贸dulo User continua莽茫o](../public/userModule1.png)
![Imagem de exemplo do m贸dulo User continua莽茫o](../public/repository.png)


## `SubM贸dulo:`
#### Um `SubM贸dulo` satisfaz um requisito ou hist贸ria de usu谩rio.

> obs: Como cada **SubM贸dulo** representa um requisito ou hist贸ria de usu谩rio eu os usei para direcionar a constru莽茫o dos **testes de integra莽茫o**

### Exemplos dos `SubM贸dulos` do `M贸dulo User`:

![Imagem com o SubM贸dulo createUser do M贸dulo User](../public/userSubModule.png)

![Imagem com o SubM贸dulo createAdmin do M贸dulo User](../public/userSubModule1.png)

## `Camadas dentro dos SubM贸dulos:`

#### Cada `SubM贸dulo` cont茅m 2 camadas a camada de `Servi莽o (Service Layer)` e a camada de `Controle (Controller Layer)`, al茅m de aplica莽茫o do `Factory Method Pattern`, onde temos um m茅todo que fabrica uma inst芒ncia de controle com suas devidas depend锚ncias injetadas. Al茅m disso, temos uma reparti莽茫o especializada em  tratar de erros e a depender do recurso solicitado temos alguns intermedi谩rios at茅 chegar no core do `SubM贸dulo`

### Exemplo do conte煤do de um SubM贸dulo do m贸dulo `User`:

![Imagem com as camadas do SubM贸dulo createUser](../public/layersSubModuleCreateUser.png)

## `Intermedi谩rios (Middlewares):`

#### Alguns m贸dulos possuem diversos `middlewares`, um `middleware` tem o papel de empregar uma sequ锚ncia de instru莽玫es com a finalidade de validar algo ou interceptar o fluxo ou aplicar um processamento especial para algum campo.

### Exemplos de `middlewares`:

![Middlewares da rota de adicionar uma imagem a uma receita](../public/middlewares.png)

## `Error Handler:`

#### O "ERROR HANDLER" que est谩 presente nos `SubM贸dulos` se divide em 2 m茅todos um que captura e trata dos `erros estruturais` que s茫o disparados pelo middleware que valida a request (validateRequest) e outro que lida com os `erros em tempo de execu莽茫o` exce莽玫es lan莽adas pela camada de servi莽o do `SubM贸dulo`.

![Error Handler](../public/errorHandler.png)

## `Camada de Modelos (Models Layer):`

#### Coloquei a `camada de modelos` em um barramento a parte com o prop贸sito de facilitar o compartilhamento deste m贸dulo entre outros servi莽os que utilizam estas mesmas entidades, usei o `JOI` para validar os conte煤dos trafegados por meio de `Schemas` e usei o `DTO Pattern (Data Transfer Object Pattern)`

![Imagem com as camadas do SubM贸dulo createUser](../public/modelsLayer.png)