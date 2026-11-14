## Ideias principais

1. Li et al., 2026 propõem um modelo BAS-BiLSTM-Attention melhorado para previsão de energia eólica, com o objectivo de “enhancing the accuracy and robustness of wind power predictions” [D2:p1 «enhancing the accuracy and robustness of wind power predictions»].

2. O estudo parte da limitação de modelos estatísticos tradicionais, pois estes têm “a strong dependency on historical data” e menor capacidade para integrar relações entre várias fontes de dados [D2:p2 «a strong dependency on historical data»].

3. A estrutura proposta combina uma camada de decomposição dos dados e uma camada de previsão de potência, descritas como “a data decomposition network layer and a power prediction layer” [D2:p3 «a data decomposition network layer and a power prediction layer»].

4. O algoritmo BAS é usado para decompor dados de energia eólica em componentes de frequência, permitindo “identify and extract significant hidden features” [D2:p4 «identify and extract significant hidden features»].

5. A componente BiLSTM procura melhorar a extracção temporal, porque a sua “bidirectional structure enhances the feature extraction network’s ability” [D2:p5 «bidirectional structure enhances the feature extraction network’s ability»].

6. O mecanismo de atenção permite que as variáveis eólicas seleccionem características relevantes, pois “wind power features can selectively focus on specified, highly correlated features” [D2:p5 «wind power features can selectively focus on specified, highly correlated features»].

7. O conjunto de dados usado contém dois anos de dados horários, de 1 de Janeiro de 2022 a 31 de Dezembro de 2023, com “approximately 17 520 samples per indicator” [D2:p6 «approximately 17 520 samples per indicator»].

8. Os resultados indicam que o modelo composto supera modelos individuais em erro e ajustamento, com MAE de 8.72, RMSE de 12.48 MW e R² de 0.93 na comparação apresentada [D2:p9 «MAE and RMSE are 8.72 and 12.48 MW»].