## Tipo de estudo e grelha de referência

Li et al., 2026 apresenta-se como um **Original Article** e propõe um modelo preditivo para previsão de potência eólica, baseado em BAS, BiLSTM e mecanismo de atenção [D2:p1 «Original Article Improved BAS-BiLSTM-Attention model for wind power forecasting»]. O estudo inclui descrição metodológica, conjunto de dados, pré-processamento, treino, avaliação e comparação com outros modelos [D2:p3 «this study proposes a wind power prediction method based on an improved»; D2:p6 «The dataset used in this study consists of 2 years»].

[Inferência] A grelha de relato mais próxima é **TRIPOD-AI**, por se tratar de desenvolvimento e avaliação de um modelo preditivo. Os critérios mais relevantes são: definição clara dos dados e participantes ou unidades de observação, preditores, desfechos, pré-processamento, separação treino-teste ou validação, métricas de desempenho, tratamento de dados ausentes, risco de sobreajuste, reprodutibilidade e limitações. Esta escolha é uma aproximação, porque o documento não afirma seguir TRIPOD-AI [D2:p6 «Data resolution is hourly, resulting in approximately 17 520 samples»; D2:p7 «Missing values accounted for less than 1% of the dataset»].

## Pontos fortes

- O objetivo do modelo é explícito: melhorar a precisão e a robustez da previsão da potência eólica através de um modelo BAS-BiLSTM-Attention [D2:p1 «enhancing the accuracy and robustness of wind power predictions»].

- O artigo descreve os componentes principais do modelo: BAS para decomposição e procura de características, BiLSTM para associações temporais bidirecionais e Attention para ponderação de características relevantes [D2:p1 «The Beetle Antennae Search algorithm was utilized for obtaining hidden features»; D2:p1 «captured the bidirectional temporal associations of hidden features»; D2:p1 «an Attention mechanism was added to ensure that the weight selection»].

- O conjunto de dados é temporalmente definido, com dados entre 1 de janeiro de 2022 e 31 de dezembro de 2023 [D2:p6 «from January 1, 2022, to December 31, 2023»].

- O estudo identifica a origem dos dados como uma estação eólica terrestre cooperante, operada pela empresa elétrica de um coautor [D2:p6 «collected from a cooperating onshore wind station operated by the co-author’s»].

- O artigo explicita seis indicadores usados no conjunto de dados: velocidade do vento, direção do vento, temperatura, pressão atmosférica, humidade e potência eólica real [D2:p6 «six key influencing indicators: wind speed»].

- O estudo indica a resolução temporal horária e cerca de 17 520 amostras por indicador [D2:p6 «Data resolution is hourly, resulting in approximately 17 520 samples»].

- O pré-processamento é descrito com algum detalhe, incluindo tratamento de dados ausentes, deteção de outliers, normalização e seleção de características [D2:p7 «The dataset preprocessing steps»].

- Os valores em falta são quantificados como inferiores a 1% do conjunto de dados [D2:p7 «Missing values accounted for less than 1% of the dataset»].

- A normalização é especificada como min-max para o intervalo [0,1] [D2:p7 «All features were scaled to [0,1] using min–max normalization»].

- O estudo usa validação cruzada temporal com cinco partições, através de TimeSeriesSplit, para preservar a ordem temporal [D2:p6 «five-fold time-series cross-validation using TimeSeriesSplit»].

- A comparação estatística entre modelos é referida através do teste de Wilcoxon para diferenças emparelhadas em métricas como MAE e RMSE [D2:p6 «Wilcoxon signed-rank test on paired differences in metrics»].

- O artigo apresenta métricas de desempenho quantitativas, incluindo MAE, RMSE, R² e MAPE [D2:p9 «Model MAE (MW) RMSE (MW) R 2 MAPE»].

- O modelo proposto apresenta, na tabela comparativa, MAE de 8.72, RMSE de 12.48, R² de 0.93 e MAPE de 5.21 [D2:p9 «Ours 8.72 12.48 0.93 5.21»].

## Fragilidades e ameaças à validade

### Validade interna

- [Inferência] A validade interna é reforçada pela validação cruzada temporal e pela comparação com modelos de referência, mas depende da adequação dos procedimentos de pré-processamento, da escolha de hiperparâmetros e da ausência de fuga de informação entre treino e teste [D2:p6 «five-fold time-series cross-validation using TimeSeriesSplit»; D2:p7 «The dataset preprocessing steps»].

- [Inferência] O artigo descreve a imputação de lacunas curtas e a substituição ou remoção de outliers, mas não apresenta uma análise detalhada de sensibilidade para comparar diferentes estratégias de imputação [D2:p7 «Short gaps ( ≤ 3 consecutive hours) were filled using linear interpolation»; D2:p7 «Outliers were identified using Z -score thresholding»].

- [Inferência] A introdução de ruído branco durante o treino pode afetar a interpretação do desempenho, porque o artigo refere esse procedimento, mas não apresenta, no excerto disponível, uma análise isolada do seu efeito [D2:p7 «After every 100 iterations, white noise is added»].

### Validade externa

- O próprio artigo reconhece que a origem dos dados numa única estação limita a generalização a outras regiões, como locais offshore ou climas tropicais [D2:p6 «its origin from a single station limits generalization to other regions»].

- [Inferência] A validade externa é limitada, porque os resultados derivam de uma estação terrestre específica e de um clima continental do norte da China, não de múltiplos parques ou contextos climáticos [D2:p6 «representative of northern China’s continental climate»; D2:p6 «its origin from a single station limits generalization to other regions»].

- O artigo sugere que trabalhos futuros poderiam usar conjuntos de dados multiestação para avaliar adaptabilidade inter-regional [D2:p6 «Future work could involve multistation datasets to assess cross-regional adaptability»].

### Validade de construto

- [Inferência] A validade de construto é razoável quanto às variáveis meteorológicas e operacionais, porque o estudo usa indicadores diretamente ligados à previsão de potência eólica, mas a seleção final depende de correlações de Pearson e não garante, por si só, causalidade ou suficiência explicativa [D2:p6 «six key influencing indicators: wind speed»; D2:p7 «Features were selected based on Pearson correlation analysis»].

- [Inferência] A utilização de MAE, RMSE, R² e MAPE cobre erro absoluto, erro quadrático, ajustamento e erro percentual, mas estas métricas não avaliam todos os aspetos operacionais possíveis da integração em rede elétrica [D2:p9 «Model MAE (MW) RMSE (MW) R 2 MAPE»; D2:p11 «suitable for ultra-short-term grid dispatching»].

### Validade estatística

- O artigo refere validação cruzada temporal, teste de Wilcoxon e intervalos de previsão derivados da variância entre dobras [D2:p6 «prediction intervals were calculated as the mean prediction ± 2 standard deviations»].

- O artigo afirma que os testes de Wilcoxon mostraram superioridade significativa face aos modelos de base, com P < .05 em todas as comparações [D2:p10 «Wilcoxon tests showing significant superiority over baseline models»].

- [Inferência] A validade estatística é fortalecida pela comparação emparelhada e pela validação temporal, mas o artigo não reporta, no texto fornecido, intervalos de confiança completos para cada métrica nem distribuições detalhadas dos erros por dobra [D2:p6 «Wilcoxon signed-rank test on paired differences in metrics»; D2:p9 «Comparison of prediction performance between single model and composite model»].

## Riscos de enviesamento

### Seleção

- [Inferência] Existe risco de enviesamento de seleção, porque os dados provêm de uma única estação eólica cooperante, e não é descrito um processo de amostragem de várias estações independentes [D2:p6 «collected from a cooperating onshore wind station»; D2:p6 «its origin from a single station limits generalization to other regions»].

- [Inferência] A seleção de características por correlação de Pearson pode favorecer variáveis linearmente associadas à potência eólica e sub-representar relações não lineares, apesar de o modelo pretender capturar relações complexas [D2:p7 «Features were selected based on Pearson correlation analysis»; D2:p1 «complex nonlinear temporal relationships in wind power forecasting»].

### Medição

- O estudo informa que os dados foram anonimizados e que o processo cumpriu normas de confidencialidade da State Grid [D2:p6 «complies with State Grid confidentiality regulations and has been anonymized»].

- [Inferência] O risco de enviesamento de medição não pode ser excluído, porque o artigo menciona falhas de sensores como causa de dados ausentes, mas não descreve calibração de sensores, auditoria externa dos registos ou validação independente das medições [D2:p7 «primarily due to sensor malfunctions»].

### Análise

- [Inferência] O risco de enviesamento analítico é mitigado pela validação temporal, pelas métricas múltiplas e pelo teste de Wilcoxon, mas persiste pela complexidade do modelo e pela multiplicidade de escolhas de pré-processamento e hiperparâmetros [D2:p6 «five-fold time-series cross-validation using TimeSeriesSplit»; D2:p7 «Network layer parameter settings»].

- [Inferência] O risco de sobreajuste é reconhecido indiretamente, pois os autores usam dropout, regularização e análises de sensibilidade dos pesos de atenção [D2:p3 «reduce the risk of overfitting, along with regularization techniques»; D2:p6 «we conducted sensitivity analyses to examine how varying the attention weights»].

### Publicação

- Não reportado.

### Conflitos de interesse e financiamento

- O financiamento é declarado como inexistente: “None declared” [D2:p12 «Funding None declared»].

- Conflitos de interesse: Não reportado.

- [Inferência] Há uma potencial fonte de interesse institucional ou operacional, porque os dados vêm de uma estação operada pela empresa elétrica de um coautor, mas o artigo não declara, no texto fornecido, conflitos de interesse específicos [D2:p6 «operated by the co-author’s power company»].

## Coerência entre dados e conclusões

- Os resultados comparativos indicam que o modelo proposto teve melhor desempenho do que os modelos listados na tabela, com MAE de 8.72, RMSE de 12.48, R² de 0.93 e MAPE de 5.21 [D2:p9 «Ours 8.72 12.48 0.93 5.21»].

- O artigo conclui que o modelo BAS-BiLSTM-Attention apresenta maior precisão e robustez do que modelos individuais e algoritmos comuns [D2:p11 «shows higher prediction accuracy and robustness across multiple evaluation metrics»].

- [Inferência] As conclusões sobre desempenho dentro deste conjunto de dados são sustentadas pelos resultados apresentados, porque a tabela comparativa mostra melhores métricas para o modelo proposto e o texto refere significância estatística face aos modelos de base [D2:p9 «Ours 8.72 12.48 0.93 5.21»; D2:p10 «P < .05 for all comparisons»].

- [Inferência] As conclusões sobre aplicabilidade geral devem ser lidas com cautela, porque o próprio artigo reconhece que uma única estação limita a generalização para outras regiões e tipos de clima [D2:p6 «its origin from a single station limits generalization to other regions»].

- [Inferência] A afirmação de utilidade em aplicações de tempo real é plausível dentro da descrição computacional apresentada, mas não é demonstrada por uma implementação operacional real em SCADA ou EMS no texto fornecido [D2:p11 «can also be applied to real-time applications»; D2:p11 «Integration into grid management systems, such as Supervisory Control and Data Acquisition»].

## Apreciação global

[Inferência] Li et al., 2026 apresenta um estudo metodologicamente estruturado, com descrição clara do modelo, do conjunto de dados, do pré-processamento, das métricas e das comparações com modelos alternativos [D2:p3 «The overall construction of the model structure is illustrated»; D2:p7 «The dataset preprocessing steps»; D2:p9 «Comparison of prediction performance between single model and composite model»].

[Inferência] A principal limitação científica é a validade externa, pois os dados derivam de uma única estação terrestre, e os próprios autores reconhecem que isso limita a generalização a outros contextos [D2:p6 «its origin from a single station limits generalization to other regions»].

[Inferência] A evidência apresentada sustenta a superioridade do modelo no cenário testado, mas não prova robustez universal em parques eólicos, regiões ou regimes climáticos diferentes [D2:p10 «confirming its higher accuracy and robustness in wind power forecasting»; D2:p6 «Future work could involve multistation datasets to assess cross-regional adaptability»].

esta é uma apreciação da IA e não substitui a aplicação formal da grelha.