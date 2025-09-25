import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search, Cpu, Zap, ChevronDown } from 'lucide-react-native';
import data from '../../data/data.json';

// Interfaz que coincide con la estructura de data.json
interface PMICData {
  REFERENCIA: string;
  VCC: string;
  SCL: string;
  SDA: string;
  MODELO?: string; // Campo opcional
}

// Convertir los datos importados al tipo correcto
const pmicData: PMICData[] = data as PMICData[];

export default function ConsultaScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [showModelFilter, setShowModelFilter] = useState(false);

  // Obtener referencias únicas para el filtro (usando los primeros 4 caracteres como identificador de modelo)
  const uniqueModels = useMemo(() => {
    // Usamos los primeros 4 caracteres de la referencia como identificador de modelo
    const modelPrefixes = [...new Set(pmicData.map(item => item.REFERENCIA.substring(0, 4).trim()))];
    return modelPrefixes.sort();
  }, []);

  // Filtrar datos basado en búsqueda
  const filteredData = useMemo(() => {
    return pmicData.filter(item => {
      // Buscar en REFERENCIA (ignorar mayúsculas/minúsculas)
      const matchesSearch = item.REFERENCIA.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Si se seleccionó un modelo, verificar que los primeros caracteres coincidan
      const matchesModel = selectedModel === '' || 
                          item.REFERENCIA.toLowerCase().startsWith(selectedModel.toLowerCase());
      
      return matchesSearch && matchesModel;
    });
  }, [searchTerm, selectedModel]);

  // Función para formatear el texto del modelo (muestra el prefijo del modelo)
  const formatModelName = (prefix: string) => {
    return prefix || 'Todos los modelos';
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedModel('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent"   />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={{ uri: 'https://bushers.com/wp-content/uploads/2024/07/cropped-logobushersok.jpg' }}  
            style={styles.headerImage}  
            resizeMode="contain"
          />      
          <Cpu size={32} color="#2563EB" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Base de Consulta</Text>
            <Text style={styles.headerSubtitle}>SCL y SDA para PMIC</Text>
          </View>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar PMIC o modelo..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowModelFilter(!showModelFilter)}
        >
          <Text style={styles.filterButtonText}>
            {selectedModel ? formatModelName(selectedModel) : 'Filtrar por modelo'}
          </Text>
          <ChevronDown size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Model Filter Dropdown */}
      {showModelFilter && (
        <View style={styles.dropdown}>
          <ScrollView style={styles.dropdownContent}>
            <TouchableOpacity 
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedModel('');
                setShowModelFilter(false);
              }}
            >
              <Text style={styles.dropdownItemText}>Todos los modelos</Text>
            </TouchableOpacity>
            {uniqueModels.map((prefix, index) => (
              <TouchableOpacity 
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedModel(prefix);
                  setShowModelFilter(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{formatModelName(prefix)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Active Filters */}
      {(searchTerm || selectedModel) && (
        <View style={styles.activeFilters}>
          <Text style={styles.activeFiltersText}>
            Resultados: {filteredData.length}
          </Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearButtonText}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results */}
      <ScrollView style={styles.resultsContainer}>
        {filteredData.length === 0 ? (
          <View style={styles.noResults}>
            <Zap size={48} color="#9CA3AF" />
            <Text style={styles.noResultsText}>
              No se encontraron resultados
            </Text>
            <Text style={styles.noResultsSubtext}>
              Intenta con otros términos de búsqueda
            </Text>
          </View>
        ) : (
          filteredData.map((item, index) => (
            <TouchableOpacity 
              key={`${item.REFERENCIA}-${index}`} 
              style={styles.itemCard}
              activeOpacity={0.8}
            >
              <View style={styles.itemHeader}>
                <Text style={styles.itemModel}>{item.REFERENCIA}</Text>
                <View style={{
                  backgroundColor: '#EFF6FF',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#1D4ED8',
                  }}>
                    {item.REFERENCIA?.substring(0, 4) || 'PMIC'}
                  </Text>
                </View>
              </View>
              <View style={styles.itemDetails}>
                <View style={styles.detailRow}>
                  <View style={{
                    backgroundColor: '#FEF3C7',
                    width: 40, // Iconos más grandes
                    height: 40,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Zap size={20} color="#D97706" />
                  </View>
                  <View>
                    <Text style={[styles.detailText, { color: '#4B5563', fontSize: 20, marginBottom: 2 }]}>
                      VCC
                    </Text>
                    <Text style={[styles.detailText, { 
                      fontWeight: '700', 
                      color: '#111827',
                      fontSize: 20 // Tamaño más grande para el valor
                    }]}>
                      {item.VCC || 'No especificado'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.detailRow}>
                  <View style={{
                    backgroundColor: '#E0F2FE',
                    width: 40, // Iconos más grandes
                    height: 40,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Cpu size={20} color="#0369A1" />
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailText, { color: '#6B7280', fontSize: 20 }]}>
                        SCL
                      </Text>
                      <Text style={[styles.detailText, { fontWeight: '600', color: '#111827' }]}>
                        {item.SCL || 'N/A'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.detailText, { color: '#6B7280', fontSize: 20 }]}>
                        SDA
                      </Text>
                      <Text style={[styles.detailText, { fontWeight: '600', color: '#111827' }]}>
                        {item.SDA || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>bushers.com • +573017578191</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14, // Bordes un poco más redondeados
    padding: 24, // Más espacio interno
    marginBottom: 20, // Más espacio entre tarjetas
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1.5, // Borde un poco más grueso
    borderColor: '#E5E7EB',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // Más espacio inferior
    paddingBottom: 14,
    borderBottomWidth: 1.5, // Línea divisoria más gruesa
    borderBottomColor: '#E5E7EB',
  },
  itemModel: {
    fontSize: 24, // Aumentado de 18
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.5,
  },
  itemDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Aumentado para mejor separación
    gap: 12, // Aumentado el espacio entre elementos
  },
  detailText: {
    fontSize: 18, // Aumentado de 15
    color: '#374151', // Color más oscuro para mejor contraste
    lineHeight: 26, // Aumentado para mejor espaciado
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',  
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  headerImage: {
    width: 100,
    height:40,
    borderRadius: 8,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 200,
  },
  dropdownContent: {
    paddingHorizontal: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#374151',
  },
  activeFilters: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  activeFiltersText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pmicName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  modelBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  modelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  pinInfo: {
    gap: 8,
  },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 40,
  },
  pinValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  connectionInfo: {
    flexDirection: 'row',
    gap: 16,
  },
  connectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    width: 40,
  },
  connectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flex: 1,
  },
  activeStatus: {
    backgroundColor: '#D1FAE5',
  },
  inactiveStatus: {
    backgroundColor: '#FEE2E2',
  },
  connectionStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeStatusText: {
    color: '#065F46',
  },
  inactiveStatusText: {
    color: '#991B1B',
  },
  footer: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
});