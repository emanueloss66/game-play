import React, { useState, useEffect } from 'react';
import Grafico from './components/Grafico';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
    const [ordenacao, setOrdenacao] = useState('recentes'); 
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

const handleSave = (horasJogo, vitorias, derrotas) => {
  // (sua lógica de conversão para números e validação continua aqui...)
  const horasJogoNum = parseFloat(horasJogo) || 0;
  const vitoriasNum = parseFloat(vitorias) || 0;
   const derrotasNum = parseFloat(derrotas) || 0;

  if (registroEmEdicao) {
    // MODO DE ATUALIZAÇÃO
    const registrosAtualizados = registros.map(reg =>
      reg.id === registroEmEdicao.id
        ? { ...reg, estudo: estudoNum, sono: sonoNum } // Mantém o ID e a data, atualiza o resto
        : reg
    );
    setRegistros(registrosAtualizados);
    Alert.alert('Sucesso!', 'Registro atualizado!');
  } else {
    // MODO DE CRIAÇÃO
    const novoRegistro = { id: new Date().getTime(), data: new Date().toLocaleDateString('pt-BR'), estudo: estudoNum, sono: sonoNum };
    setRegistros([...registros, novoRegistro]);
    Alert.alert('Sucesso!', 'Registro salvo!');
  }

  setRegistroEmEdicao(null); // Limpa o estado de edição e o formulário
};

  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

const handleIniciarEdicao = (registro) => {
  setRegistroEmEdicao(registro);
};

const handleCancelarEdicao = () => {
  setRegistroEmEdicao(null);
};

  const exportarDados = async () => {
      const fileUri = Database.fileUri; // Usando a variável exportada se disponível, senão recriar
      if (Platform.OS === 'web') {
          const jsonString = JSON.stringify(registros, null, 2);
          if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
          URL.revokeObjectURL(url);
      } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
          await Sharing.shareAsync(fileUri);
      }
  };

  if (carregando) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3498db" /></View>;
  }



let registrosExibidos = [...registros]; 

if (ordenacao === 'horasJogo_') {
  
  registrosExibidos.sort((a, b) => b.derrotas - a.vitorias);
} else {
  registrosExibidos.sort((a, b) => b.id - a.id);
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>game play</Text>
         <Grafico registros={registrosExibidos} />
        <Text style={styles.subtituloApp}>App Componentizado</Text>


      <Formulario
  onSave={handleSave}
  onCancel={handleCancelarEdicao}
  registroEmEdicao={registroEmEdicao}
/>

<View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10 }}>
  <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
  <Button title="Maior Valor (horasJogo)" onPress={() => setOrdenacao('horasJogo')} />
  <Button title="Editar" onPress={() => onEdit(reg)} />
</View>

       <ListaRegistros
  registros={registrosExibidos}
  onEdit={handleIniciarEdicao}
  onDelete={handleDelete}
/>

        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar "Banco de Dados"</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#212f3f' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#feecc7' },
  subtituloApp: { textAlign: 'center', fontSize: 16, color: '#555', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: '#feecc7', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
  botaoExportar: { backgroundColor: '#34495e', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});