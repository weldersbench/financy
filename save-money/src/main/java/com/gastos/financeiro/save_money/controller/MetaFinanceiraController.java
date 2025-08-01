package com.gastos.financeiro.save_money.controller;

import com.gastos.financeiro.save_money.model.MetaFinanceira;
import com.gastos.financeiro.save_money.repository.MetaFinanceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/meta_financeira")
public class MetaFinanceiraController {

    // Persistencia e injeção de dependencias
    @Autowired
    private MetaFinanceiraRepository metaFinanceiraRepository;

    // Criar uma nova meta
    @PostMapping
    public ResponseEntity<MetaFinanceira> criarMeta(@RequestBody MetaFinanceira meta){
        MetaFinanceira novaMeta = metaFinanceiraRepository.save(meta);
        return new ResponseEntity<>(novaMeta, HttpStatus.CREATED);
    }

    // Buscar todas as metas
    @GetMapping
    public ResponseEntity<List<MetaFinanceira>> listarTodasMetas(){
        List<MetaFinanceira> listaMetas = metaFinanceiraRepository.findAll();
        return new ResponseEntity<>(listaMetas, HttpStatus.OK);
    }

    // Buscar por uma meta especifica
    @GetMapping("/{id}")
    public ResponseEntity<MetaFinanceira> listarMetaPorId(@PathVariable Long id){
        Optional<MetaFinanceira> meta = metaFinanceiraRepository.findById(id);
        return meta.map(valor -> new ResponseEntity<>(valor, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Atualizar uma meta
    @PutMapping("/{id}")
    public ResponseEntity<MetaFinanceira> atualizarMeta(@PathVariable Long id, @RequestBody MetaFinanceira metaAtualizada){
        return metaFinanceiraRepository.findById(id)
                .map(meta -> {
                    meta.setNome(metaAtualizada.getNome());
                    meta.setValorAlvo(metaAtualizada.getValorAlvo());
                    meta.setValorAtual(metaAtualizada.getValorAtual());
                    meta.setDataAlvo(metaAtualizada.getDataAlvo());
                    meta.setStatus(metaAtualizada.getStatus());
                    meta.setDescricao(metaAtualizada.getDescricao());
                    MetaFinanceira salvar = metaFinanceiraRepository.save(meta);
                    return new ResponseEntity<>(salvar, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Deletar uma meta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletaMeta(@PathVariable Long id){
        if (metaFinanceiraRepository.existsById(id)){
            metaFinanceiraRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
}
