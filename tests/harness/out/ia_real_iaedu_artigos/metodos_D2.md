## Li et al., 2026

### Desenho do estudo

Li et al., 2026 apresenta um estudo experimental de previsão de energia eólica, baseado no desenvolvimento e teste de um modelo composto BAS, BiLSTM e Attention [D2:p1 «we proposed an improved BAS-BiLSTM- Attention model»].

O objectivo metodológico foi melhorar a exactidão e a robustez da previsão da energia eólica através da combinação de decomposição de dados, modelação temporal bidireccional e ponderação dinâmica de características [D2:p1 «enhancing the accuracy and robustness of wind power predictions»].

O desenho incluiu comparação entre o modelo proposto e modelos individuais ou modelos de referência, com avaliação por métricas quantitativas de erro e ajustamento [D2:p9 «selected representative individual models for comparison of wind power forecasting results»].

### População e amostra

A população-alvo, em sentido estatístico amplo, não é definida de forma explícita pelos autores. **Não reportado**.

A amostra corresponde a dados históricos de energia eólica de 2 anos, entre 1 de Janeiro de 2022 e 31 de Dezembro de 2023 [D2:p6 «from January 1, 2022, to December 31, 2023»].

Os dados foram recolhidos numa estação eólica terrestre cooperante, operada pela empresa de energia de um co-autor [D2:p6 «collected from a cooperating onshore wind station operated by»].

A resolução dos dados foi horária, com aproximadamente 17 520 amostras por indicador [D2:p6 «Data resolution is hourly, resulting in approximately 17 520 samples»].

O recrutamento de participantes humanos não se aplica, pois o estudo usa dados ambientais e de produção energética. Os autores referem que evitaram dados pessoais sensíveis [D2:p6 «we avoided sensitive personal data, focusing on environmental indicators»].

Critérios de inclusão de variáveis foram definidos por análise de correlação de Pearson, retendo características com coeficientes superiores a 0.5 em relação à produção eólica [D2:p7 «retaining those with coefficients > 0.5 relative to wind power output»].

Critérios de exclusão de observações incluíram remoção de valores extremos quando eram extremos, afectando menos de 0.5% dos dados [D2:p7 «removed if extreme (affecting < 0.5% of data)»].

### Contexto e período

O contexto foi uma estação eólica terrestre situada numa região com variações sazonais fortes, ventos fortes no Inverno e condições mais suaves no Verão [D2:p6 «strong winds in winter and milder conditions in summer»].

Os autores descrevem esta região como representativa do clima continental do norte da China [D2:p6 «representative of northern China’s continental climate»].

O período de observação foi de 1 de Janeiro de 2022 a 31 de Dezembro de 2023 [D2:p6 «from January 1, 2022, to December 31, 2023»].

### Variáveis ou categorias

O conjunto de dados incluiu seis indicadores principais: velocidade do vento, direcção do vento, temperatura, pressão do ar, humidade e produção eólica real [D2:p6 «wind speed (m/s), wind direction (degrees), temperature»].

Os autores também indicam variáveis adicionais consideradas para lidar com volatilidade e incerteza, incluindo temperatura, pressão atmosférica, produção histórica, factores sazonais, dados geoespaciais, especificações das turbinas e previsões meteorológicas [D2:p6 «temperature, atmospheric pressure, historical power output, seasonal factors»].

A variável de saída principal foi a produção eólica real, indicada no conjunto de dados como “actual wind power output (MW)” [D2:p6 «actual wind power output (MW), as shown in Table 1»].

As categorias de decomposição dos dados incluíram dados originais, uma decomposição e duas decomposições [D2:p8 «Original 85.32 110.45 0.821»].

### Instrumentos e medidas

O principal instrumento analítico foi o modelo BAS, BiLSTM e Attention melhorado [D2:p11 «improved BAS-BiLSTM-Attention model for wind power forecasting»].

O algoritmo BAS foi usado para pesquisa e decomposição de características dos dados de energia eólica [D2:p11 «BAS algorithm for feature search and decomposition of wind power data»].

O BiLSTM foi usado para captar associações temporais bidireccionais das características ocultas [D2:p11 «capture the bidirectional temporal associations of hidden wind power features»].

O mecanismo de Attention foi usado para concentrar a previsão em características altamente relevantes durante a alocação dinâmica de pesos [D2:p11 «selectively focus on specified highly relevant features during the dynamic»].

As medidas de desempenho incluíram MAE e RMSE, usadas para avaliar discrepâncias entre valores previstos e valores reais [D2:p7 «MAE and the RMSE as metrics of evaluation»].

O MAE foi descrito como o desvio absoluto médio dos valores previstos face aos valores reais [D2:p7 «average absolute deviation of the predicted values from the actual»].

O RMSE foi descrito como uma medida do erro quadrático médio entre valores previstos e reais [D2:p7 «square mean error of the discrepancies between the predicted»].

Também foram reportados R², MAPE e valores de p em comparação com o modelo proposto [D2:p9 «R 2 MAPE (%) P (vs. Ours)»].

Quanto à validade, os autores referem validação estatística e comparações justas, mas não apresentam uma validação independente do instrumento de medição físico [D2:p6 «conducted statistical validations for fair comparisons»].

Quanto à fiabilidade, os autores indicam validação cruzada temporal em cinco partes para mitigar sobreajustamento e fuga de dados futuros [D2:p6 «five-fold time-series cross-validation using TimeSeriesSplit»].

Intervalos de previsão foram calculados como média da previsão mais ou menos 2 desvios-padrão, derivados da variância do ensemble entre folds [D2:p6 «mean prediction ± 2 standard deviations, derived from»].

### Procedimentos

Os dados foram anonimizados para remover informação identificável, de acordo com regras de confidencialidade da State Grid [D2:p6 «has been anonymized to remove any identifiable information»].

O pré-processamento incluiu tratamento de dados em falta, detecção e remoção de outliers, normalização e selecção de características [D2:p7 «The dataset preprocessing steps»].

Os valores em falta representaram menos de 1% do conjunto de dados e ocorreram sobretudo por avarias dos sensores [D2:p7 «Missing values accounted for less than 1% of the dataset»].

Lacunas curtas, até 3 horas consecutivas, foram preenchidas por interpolação linear entre pontos adjacentes [D2:p7 «filled using linear interpolation between adjacent points»].

Falhas isoladas foram preenchidas com forward-fill [D2:p7 «isolated misses used forward-fill»].

Os outliers foram identificados por limiar Z-score, com valor absoluto de Z superior a 3 [D2:p7 «using Z -score thresholding (| Z | > 3)»].

Todas as características foram escaladas para o intervalo [0,1] por normalização min-max [D2:p7 «All features were scaled to [0,1] using min–max normalization»].

A selecção de características reteve variáveis com correlação superior a 0.5 com a produção eólica [D2:p7 «coefficients > 0.5 relative to wind power output»].

A sequência metodológica começou com decomposição dos dados pelo BAS, seguida por extracção temporal bidireccional no BiLSTM e ponderação pelo mecanismo de Attention [D2:p3 «data decomposition network layer and a power prediction layer»].

O treino foi realizado com 100 épocas no enquadramento descrito para os ensaios computacionais [D2:p6 «training over 100 epochs took approximately 15 minutes»].

Noutra secção, os autores também indicam que o número máximo de épocas por iteração foi 200, com dropout de 0.3 [D2:p7 «maximum number of epochs for each iteration is set to 200»].

Há, portanto, uma diferença textual entre a descrição do treino em 100 épocas e a configuração que define máximo de 200 épocas. Os autores não esclarecem esta diferença no texto fornecido [D2:p6 «training over 100 epochs took approximately 15 minutes»; D2:p7 «maximum number of epochs for each iteration is set to 200»].

Após cada 100 iterações, foi acrescentado ruído branco para optimizar a taxa de viés da rede [D2:p7 «After every 100 iterations, white noise is added»].

### Técnicas de análise e software

A análise inicial usou correlação de Pearson para identificar indicadores candidatos de energia eólica [D2:p6 «We initially validate the data using Pearson correlation»].

A validação do modelo usou validação cruzada temporal em cinco partes com TimeSeriesSplit [D2:p6 «five-fold time-series cross-validation using TimeSeriesSplit»].

As comparações entre modelos foram avaliadas com o teste de Wilcoxon signed-rank, aplicado às diferenças emparelhadas em métricas como MAE e RMSE [D2:p6 «Wilcoxon signed-rank test on paired differences in metrics»].

As métricas quantitativas usadas na avaliação foram MAE, RMSE, R² e MAPE [D2:p9 «Model MAE (MW) RMSE (MW) R 2 MAPE»].

O software reportado foi PyTorch, com optimizador Adam [D2:p6 «using PyTorch framework and Adam optimizer»].

O treino foi executado em Intel Core i7-10700 CPU, com 16 GB de RAM, e NVIDIA RTX 3060 GPU, com 6 GB de VRAM [D2:p6 «Intel Core i7- 10700 CPU (2.9 GHz, 16 GB RAM)»].

O optimizador Adam foi usado com taxa de aprendizagem 0.001 e batch size 64 [D2:p6 «Adam optimizer (learning rate 0.001, batch size 64)»].

O modelo tinha aproximadamente 500 000 parâmetros e exigiu cerca de 4 GB de memória GPU durante o treino [D2:p6 «approximately 500 000 parameters, required about 4 GB»].

## Tabela de resultados quantitativos

| Resultado | Valor, estatística, efeito, intervalo de confiança, p | Grupo ou condição | Fonte |
|---|---:|---|---|
| MAE | 85.32 MW [D2:p8 «BAS Original 85.32 110.45 0.821»] | BAS, dados originais [D2:p8 «BAS Original 85.32 110.45 0.821»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 110.45 MW [D2:p8 «BAS Original 85.32 110.45 0.821»] | BAS, dados originais [D2:p8 «BAS Original 85.32 110.45 0.821»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.821 [D2:p8 «BAS Original 85.32 110.45 0.821»] | BAS, dados originais [D2:p8 «BAS Original 85.32 110.45 0.821»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 62.14 MW [D2:p8 «One decomposition 62.14 85.23 0.905»] | BAS, uma decomposição [D2:p8 «One decomposition 62.14 85.23 0.905»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 85.23 MW [D2:p8 «One decomposition 62.14 85.23 0.905»] | BAS, uma decomposição [D2:p8 «One decomposition 62.14 85.23 0.905»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.905 [D2:p8 «One decomposition 62.14 85.23 0.905»] | BAS, uma decomposição [D2:p8 «One decomposition 62.14 85.23 0.905»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 48.76 MW [D2:p8 «Two decompositions 48.76 68.34 0.942»] | BAS, duas decomposições [D2:p8 «Two decompositions 48.76 68.34 0.942»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 68.34 MW [D2:p8 «Two decompositions 48.76 68.34 0.942»] | BAS, duas decomposições [D2:p8 «Two decompositions 48.76 68.34 0.942»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.942 [D2:p8 «Two decompositions 48.76 68.34 0.942»] | BAS, duas decomposições [D2:p8 «Two decompositions 48.76 68.34 0.942»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 81.51 MW [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | BiLSTM, dados originais [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 105.25 MW [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | BiLSTM, dados originais [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.834 [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | BiLSTM, dados originais [D2:p8 «BiLSTM Original 81.51 105.25 0.834»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 58.76 MW [D2:p8 «One decomposition 58.76 82.31 0.912»] | BiLSTM, uma decomposição [D2:p8 «One decomposition 58.76 82.31 0.912»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 82.31 MW [D2:p8 «One decomposition 58.76 82.31 0.912»] | BiLSTM, uma decomposição [D2:p8 «One decomposition 58.76 82.31 0.912»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.912 [D2:p8 «One decomposition 58.76 82.31 0.912»] | BiLSTM, uma decomposição [D2:p8 «One decomposition 58.76 82.31 0.912»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 45.12 MW [D2:p8 «Two decompositions 45.12 65.24 0.954»] | BiLSTM, duas decomposições [D2:p8 «Two decompositions 45.12 65.24 0.954»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 65.24 MW [D2:p8 «Two decompositions 45.12 65.24 0.954»] | BiLSTM, duas decomposições [D2:p8 «Two decompositions 45.12 65.24 0.954»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.954 [D2:p8 «Two decompositions 45.12 65.24 0.954»] | BiLSTM, duas decomposições [D2:p8 «Two decompositions 45.12 65.24 0.954»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 86.45 MW [D2:p8 «Attention Original 86.45 115.23 0.798»] | Attention, dados originais [D2:p8 «Attention Original 86.45 115.23 0.798»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 115.23 MW [D2:p8 «Attention Original 86.45 115.23 0.798»] | Attention, dados originais [D2:p8 «Attention Original 86.45 115.23 0.798»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.798 [D2:p8 «Attention Original 86.45 115.23 0.798»] | Attention, dados originais [D2:p8 «Attention Original 86.45 115.23 0.798»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 67.15 MW [D2:p8 «One decomposition 67.15 91.87 0.890»] | Attention, uma decomposição [D2:p8 «One decomposition 67.15 91.87 0.890»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 91.87 MW [D2:p8 «One decomposition 67.15 91.87 0.890»] | Attention, uma decomposição [D2:p8 «One decomposition 67.15 91.87 0.890»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.890 [D2:p8 «One decomposition 67.15 91.87 0.890»] | Attention, uma decomposição [D2:p8 «One decomposition 67.15 91.87 0.890»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 51.24 MW [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Attention, duas decomposições [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| RMSE | 71.34 MW [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Attention, duas decomposições [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| R² | 0.937 [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Attention, duas decomposições [D2:p8 «Two decompositions 51.24 71.34 0.937»] | Tabela 4 [D2:p8 «Wind power impact of data decomposition times at different»] |
| MAE | 14.23 MW [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | SVR [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 21.46 MW [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | SVR [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.81 [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | SVR [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 8.97% [D2:p9 «14.23 21.46 0.81 8.97 .012»] | SVR [D2:p9 «SVR [ 41 ] 14.23 21.46 0.81»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .012 [D2:p9 «14.23 21.46 0.81 8.97 .012»] | SVR vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 12.45 MW [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | LSTM [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 18.32 MW [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | LSTM [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.85 [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | LSTM [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 7.64% [D2:p9 «12.45 18.32 0.85 7.64 .031»] | LSTM [D2:p9 «LSTM [ 11 ] 12.45 18.32 0.85»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .031 [D2:p9 «12.45 18.32 0.85 7.64 .031»] | LSTM vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 13.02 MW [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | GRU [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 19.15 MW [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | GRU [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.83 [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | GRU [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 8.12% [D2:p9 «13.02 19.15 0.83 8.12 .008»] | GRU [D2:p9 «GRU [ 42 ] 13.02 19.15 0.83»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .008 [D2:p9 «13.02 19.15 0.83 8.12 .008»] | GRU vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 15.67 MW [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | BAS [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 22.58 MW [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | BAS [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.78 [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | BAS [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 9.34% [D2:p9 «15.67 22.58 0.78 9.34 .024»] | BAS [D2:p9 «BAS [ 43 ] 15.67 22.58 0.78»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .024 [D2:p9 «15.67 22.58 0.78 9.34 .024»] | BAS vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 11.34 MW [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | CNN-Transformer [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 21.35 MW [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | CNN-Transformer [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.91 [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | CNN-Transformer [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 7.97% [D2:p9 «11.34 21.35 0.91 7.97 .019»] | CNN-Transformer [D2:p9 «CNN-Transformer [ 30 ] 11.34 21.35 0.91»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .019 [D2:p9 «11.34 21.35 0.91 7.97 .019»] | CNN-Transformer vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 12.87 MW [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | EMD–LSTM [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 15.97 MW [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | EMD–LSTM [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.84 [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | EMD–LSTM [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 6.49% [D2:p9 «12.87 15.97 0.84 6.49 .038»] | EMD–LSTM [D2:p9 «EMD–LSTM [ 31 ] 12.87 15.97 0.84»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .038 [D2:p9 «12.87 15.97 0.84 6.49 .038»] | EMD–LSTM vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 10.23 MW [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | WOA–GRU [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| RMSE | 18.13 MW [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | WOA–GRU [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| R² | 0.89 [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | WOA–GRU [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAPE | 6.13% [D2:p9 «10.23 18.13 0.89 6.13 .041»] | WOA–GRU [D2:p9 «WOA–GRU [ 32 ] 10.23 18.13 0.89»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| p vs. Ours | .041 [D2:p9 «10.23 18.13 0.89 6.13 .041»] | WOA–GRU vs. Ours [D2:p9 «P (vs. Ours)»] | Tabela 5 [D2:p9 «Comparison of prediction performance between single model and composite»] |
| MAE | 8.72 MW [D2:p9 «Ours 8.72 12.48 0.93 5.21»] | Modelo proposto [D2:p9 «Ours 