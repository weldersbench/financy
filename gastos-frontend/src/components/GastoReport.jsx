// src/components/GastoReport.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF194C', '#19FFD5', '#1954FF'];

function GastoReport({ gastos }) {

    console.log("GastoReport: gastos recebidos", gastos); // <--- LOG 1

    const dataForChart = gastos.reduce((acc, gasto) => {
        const categoria = gasto.categoria || 'Sem Categoria';
        const valor = parseFloat(gasto.valor); // Converte valor para número

        // Importante: verificar se o valor é um número válido após parseFloat
        if (isNaN(valor)) {
            console.warn(`GastoReport: Valor inválido para a categoria ${categoria}:`, gasto.valor); // <--- LOG 2 (aviso)
            return acc; // Pula este gasto se o valor for inválido
        }

        const existingCategory = acc.find(item => item.name === categoria);

        if (existingCategory) {
            existingCategory.value += valor;
        } else {
            acc.push({ name: categoria, value: valor });
        }
        return acc;
    }, []);

    console.log("GastoReport: dataForChart (dados agregados)", dataForChart); // <--- LOG 3

    const totalGastos = dataForChart.reduce((sum, entry) => sum + entry.value, 0);

    console.log("GastoReport: Total de Gastos", totalGastos); // <--- LOG 4


    return (
        <div>
            <h2>Resumo de Gastos por Categoria</h2>
            {/* Renderiza o p se não houver gastos OU se o dataForChart estiver vazio após a agregação */}
            {gastos.length === 0 || dataForChart.length === 0 ? (
                <p>Adicione gastos para ver o relatório.</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={dataForChart}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {dataForChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default GastoReport;