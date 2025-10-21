import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [horasJogo, setHorasJogo] = useState('');
  const [vitorias, setVitorias] = useState('');
  const [derrotas, setDerrotas] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setHorasJogo(String(registroEmEdicao.HorasJogo));
      setHorasVitorias(String(registroEmEdicao.Vitorias));
     setHorasDerrotas(String(registroEmEdicao.Derrotas));
    } else {
      setHorasJogo('');
      setVitorias('');
      setDerrotas('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(horasJogo, vitorias, derrotas);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>
      <TextInput style={styles.input} placeholder="Horas de jogo" keyboardType="numeric" value={horasJogo} onChangeText={setHorasJogo} />
      <TextInput style={styles.input} placeholder="Vitorias" keyboardType="numeric" value={vitorias} onChangeText={setVitorias} />
      <TextInput style={styles.input} placeholder="Derrotas" keyboardType="numeric" value={derrotas} onChangeText={setDerrotas} />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#feecc7', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
    subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#34495e' },
    input: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
    botao: { backgroundColor: '#2a445c', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    botaoCancelar: { backgroundColor: '#7f8c8d', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});