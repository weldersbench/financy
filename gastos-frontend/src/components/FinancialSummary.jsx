// src/components/FinancialSummary.jsx
import React, { useState, useEffect } from 'react';

function FinancialSummary({ gastos, receitas }) {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // Estados para controlar o mês e ano selecionados
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Estados para os valores calculados
    const [totalReceitas, setTotalReceitas] = useState(0);
    const [totalGastos, setTotalGastos] = useState(0);
    const [saldoLiquido, setSaldoLiquido] = useState(0);

    // Arrays para popular os dropdowns de mês e ano
    const months = [
        { value: 0, label: 'Janeiro' },
        { value: 1, label: 'Fevereiro' },
        { value: 2, label: 'Março' },
        { value: 3, label: 'Abril' },
        { value: 4, label: 'Maio' },
        { value: 5, label: 'Junho' },
        { value: 6, label: 'Julho' },
        { value: 7, label: 'Agosto' },
        { value: 8, label: 'Setembro' },
        { value: 9, label: 'Outubro' },
        { value: 10, label: 'Novembro' },
        { value: 11, label: 'Dezembro' },
    ];

    const years = [];
    const startYear = 2020; // Defina um ano de início razoável
    const endYear = currentYear + 1; // Até o ano atual + 1
    for (let i = startYear; i <= endYear; i++) {
        years.push(i);
    }

    // useEffect para recalcular o resumo sempre que gastos, receitas, mês ou ano selecionados mudarem
    useEffect(() => {
        const calculateSummary = () => {
            // Filtra para o mês e ano selecionados
            const filteredGastos = gastos.filter(gasto => {
                const gastoDate = new Date(gasto.dataHora);
                return gastoDate.getMonth() === selectedMonth && gastoDate.getFullYear() === selectedYear;
            });

            const filteredReceitas = receitas.filter(receita => {
                const receitaDate = new Date(receita.dataRecebimento);
                return receitaDate.getMonth() === selectedMonth && receitaDate.getFullYear() === selectedYear;
            });

            // Soma os totais
            const sumGastos = filteredGastos.reduce((sum, gasto) => sum + parseFloat(gasto.valor), 0);
            const sumReceitas = filteredReceitas.reduce((sum, receita) => sum + parseFloat(receita.valor), 0);

            const saldo = sumReceitas - sumGastos;

            setTotalReceitas(sumReceitas);
            setTotalGastos(sumGastos);
            setSaldoLiquido(saldo);
        };

        calculateSummary();
    }, [gastos, receitas, selectedMonth, selectedYear]); // Dependências do useEffect

    // Funções auxiliares para formatar moeda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div>
            <h2>Resumo Financeiro por Período</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
                {/* Dropdown de Mês */}
                <div>
                    <label htmlFor="month-select">Mês:</label>
                    <select
                        id="month-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        style={{ marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        {months.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>

                {/* Dropdown de Ano */}
                <div>
                    <label htmlFor="year-select">Ano:</label>
                    <select
                        id="year-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        style={{ marginLeft: '5px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                <p>Total de Receitas: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>{formatCurrency(totalReceitas)}</span></p>
                <p>Total de Gastos: <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{formatCurrency(totalGastos)}</span></p>
                <p>Saldo Líquido: 
                    <span style={{ color: saldoLiquido >= 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                        {formatCurrency(saldoLiquido)}
                    </span>
                </p>
                {saldoLiquido < 0 && (
                    <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '5px' }}>Você está gastando mais do que ganha neste período!</p>
                )}
            </div>
        </div>
    );
}

export default FinancialSummary;