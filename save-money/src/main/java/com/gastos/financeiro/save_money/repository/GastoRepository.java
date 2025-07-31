package com.gastos.financeiro.save_money.repository;

import com.gastos.financeiro.save_money.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GastoRepository  extends JpaRepository<Gasto, Long> {
}
