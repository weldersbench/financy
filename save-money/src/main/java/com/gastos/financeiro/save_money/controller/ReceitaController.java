package com.gastos.financeiro.save_money.controller;

import com.gastos.financeiro.save_money.model.Receita;
import com.gastos.financeiro.save_money.repository.ReceitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/receitas")
public class ReceitaController {

    @Autowired
    private ReceitaRepository receitaRepository;

    @PostMapping
    public ResponseEntity<Receita> criarReceita(@RequestBody Receita receita){
        Receita novaReceita = receitaRepository.save(receita);
        return new ResponseEntity<>(novaReceita, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Receita>> listarTodasRceitas(){
        List<Receita> receitas = receitaRepository.findAll();
        return new ResponseEntity<>(receitas, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<Receita> buscaReceitaPorId(@PathVariable Long id){
        Optional<Receita> receita = receitaRepository.findById(id);
        return receita.map(valor -> new ResponseEntity<>(valor, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Receita> atualizarReceita(@PathVariable Long id, @RequestBody Receita receitaAtualizada){
        return receitaRepository.findById(id)
                .map(receita -> {
                    receita.setCategoria(receitaAtualizada.getCategoria());
                    receita.setValor(receitaAtualizada.getValor());
                    receita.setFonte(receitaAtualizada.getFonte());
                    receita.setDescricao(receitaAtualizada.getDescricao());
                    receita.setDataRecebimento(receitaAtualizada.getDataRecebimento());
                    receita.setNotificacao(receitaAtualizada.getNotificacao());
                    Receita salvo = receitaRepository.save(receita);
                    return new ResponseEntity<>(salvo, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaReceitaPorId(@PathVariable Long id){
        if (receitaRepository.existsById(id)){
            receitaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
