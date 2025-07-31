package com.gastos.financeiro.save_money.controller;

import com.gastos.financeiro.save_money.model.Gasto;
import com.gastos.financeiro.save_money.repository.GastoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired
    private GastoRepository gastoRepository;

    // Endpoint para criar um novo gasto
    @PostMapping
    public ResponseEntity<Gasto> criarGasto(@RequestBody Gasto gasto){
        Gasto novoGasto = gastoRepository.save(gasto);
        return new ResponseEntity<>(novoGasto, HttpStatus.CREATED);
    }

    // Endpoint para listar todos os gastos
    @GetMapping
    public ResponseEntity<List<Gasto>> listarTodosGastos(){
        List<Gasto> gastos = gastoRepository.findAll();
        return new ResponseEntity<>(gastos, HttpStatus.OK);
    }

    // Endpoint para buscar um gasto por ID
    @GetMapping("/{id}")
    /*
    ResponseEntity<Gasto> = Tipo do retorno do metodo / ResponseEntity = É uma classe do Spring que representa a resposta HTTP completa.
    <Gasto> = Indica que o corpo da resposta, se houver um, será do tipo Gasto.
    @PathVariable = Esta anotação é usada para vincular o valor da variável de caminho.
    Optional = é uma classe do Java 8 que é um container que pode ou não conter um valor não nulo.
    * */
    public ResponseEntity<Gasto> buscarGastoPorId(@PathVariable Long id){
        Optional<Gasto> gasto = gastoRepository.findById(id);
        /*
        Se o Optional (gasto) contiver um valor, A função lambda
        valar -> new ResponseEntity<>(value, HttpStatus.OK) é executada.
        O valar dentro da lambda é o objeto Gasto que foi encontrado. Ele cria uma nova ResponseEntity com: O objeto Gasto como corpo da resposta e o code OK 200.

        Se o Optional (gasto) estiver vazio, A função lambda não é executada, chamado o metodo encadeado, que é .orElseGet().
        .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        .orElseGet(...): Este metodo do Optional é executado somente se o Optional estiver vazio (se nenhum Gasto foi encontrado no map anterior).
        () -> new ResponseEntity<>(HttpStatus.NOT_FOUND):
        Esta é a função lambda que é executada quando o Optional está vazio. Ela cria uma nova ResponseEntity com: Um corpo de resposta vazio.
        O código de status HttpStatus.NOT_FOUND 404 Not Found).
        * */
        return gasto.map(valor -> new ResponseEntity<>(valor, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint para atualizar um gasto existente
    @PutMapping("/{id}")
    public ResponseEntity<Gasto> atualizarGasto(@PathVariable Long id, @RequestBody Gasto gastoAtualizado){
        return gastoRepository.findById(id)
                .map(gasto -> {
                    gasto.setDescricao(gastoAtualizado.getDescricao());
                    gasto.setValor(gastoAtualizado.getValor());
                    gasto.setCategoria(gastoAtualizado.getCategoria());
                    gasto.setEstabelecimento(gastoAtualizado.getEstabelecimento());
                    gasto.setDataHora(gastoAtualizado.getDataHora());
                    gasto.setSmsOriginal(gastoAtualizado.getSmsOriginal());
                    Gasto salvo = gastoRepository.save(gasto);
                    return new ResponseEntity<>(salvo, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint para deletar um gasto por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarGasto(@PathVariable Long id) {
        if (gastoRepository.existsById(id)) {
            gastoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
