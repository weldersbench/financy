// src/components/GastoEditForm.jsx
import React, { useState, useEffect } from 'react';

// Este componente recebe o 'gasto' a ser editado e duas funções de callback
function GastoEditForm({ gasto, onGastoUpdated, onCancelEdit }) {
  // Estados para os campos do formulário, inicializados com os dados do gasto
  const [valor, setValor] = useState(gasto.valor || '');
  const [dataHora, setDataHora] = useState(gasto.dataHora ? gasto.dataHora.substring(0, 16) : ''); // datetime-local espera YYYY-MM-DDTHH:MM
  const [estabelecimento, setEstabelecimento] = useState(gasto.estabelecimento || '');
  const [categoria, setCategoria] = useState(gasto.categoria || 'Não Categorizado');
  const [descricao, setDescricao] = useState(gasto.descricao || '');
  const [remetenteSms, setRemetenteSms] = useState(gasto.remetenteSms || '');
  const [smsOriginal, setSmsOriginal] = useState(gasto.smsOriginal || '');

  const API_URL = 'http://localhost:8080/api/gastos';

  // useEffect para garantir que o formulário atualize se o 'gasto' prop mudar
  // (Útil se você for reutilizar o formulário para diferentes gastos sem remontá-lo)
  useEffect(() => {
    setValor(gasto.valor || '');
    setDataHora(gasto.dataHora ? gasto.dataHora.substring(0, 16) : '');
    setEstabelecimento(gasto.estabelecimento || '');
    setCategoria(gasto.categoria || 'Não Categorizado');
    setDescricao(gasto.descricao || '');
    setRemetenteSms(gasto.remetenteSms || '');
    setSmsOriginal(gasto.smsOriginal || '');
  }, [gasto]); // Dependência no objeto gasto

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação básica
    if (!valor || !dataHora || !estabelecimento) {
      alert('Por favor, preencha Valor, Data/Hora e Estabelecimento.');
      return;
    }

    const gastoAtualizado = {
      id: gasto.id, // O ID é crucial para a atualização
      valor: parseFloat(valor.replace(',', '.')),
      dataHora: dataHora,
      estabelecimento: estabelecimento,
      categoria: categoria,
      descricao: descricao,
      remetenteSms: remetenteSms,
      smsOriginal: smsOriginal
    };

    try {
      const response = await fetch(`${API_URL}/${gasto.id}`, { // Requisição PUT para o ID específico
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gastoAtualizado),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro ao atualizar gasto:', errorData);
        throw new Error(`Falha ao atualizar gasto: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const updatedGasto = await response.json();
      console.log('Gasto atualizado com sucesso:', updatedGasto);
      alert('Gasto atualizado com sucesso!');

      // Notificar o componente pai para recarregar a lista e sair do modo de edição
      if (onGastoUpdated) {
        onGastoUpdated();
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      alert(`Erro ao atualizar gasto: ${error.message}. Verifique o console.`);
    }
  };

  return (
    <div>
      <h2>Editar Gasto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Valor (R$):</label>
          <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} required />
        </div>
        <div>
          <label>Data/Hora:</label>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
        </div>
        <div>
          <label>Estabelecimento:</label>
          <input type="text" value={estabelecimento} onChange={(e) => setEstabelecimento(e.target.value)} required />
        </div>
        <div>
          <label>Categoria:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Não Categorizado">Não Categorizado</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Moradia">Moradia</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label>Descrição (opcional):</label>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        <div>
          <label>Remetente SMS (opcional):</label>
          <input type="text" value={remetenteSms} onChange={(e) => setRemetenteSms(e.target.value)} />
        </div>
        <div>
          <label>SMS Original (opcional):</label>
          <textarea value={smsOriginal} onChange={(e) => setSmsOriginal(e.target.value)} rows="3"></textarea>
        </div>
        <button type="submit">Salvar Alterações</button>
        <button type="button" onClick={onCancelEdit}>Cancelar</button> {/* Botão para cancelar edição */}
      </form>
    </div>
  );
  
}
export default GastoEditForm;