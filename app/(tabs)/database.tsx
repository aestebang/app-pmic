import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Database, ChartBar as BarChart3, Cpu, TrendingUp } from 'lucide-react-native';
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


export default function DatabaseScreen() {
  const [selectedView, setSelectedView] = useState<'stats' | 'table'>('stats');

  // Calcular estadísticas
  // console.log(data);
  const stats = useMemo(() => {
    const totalPmics = pmicData.length;
    
    // Contar SCL y SDA que no son 'x' o vacíos
    const activeSCL = pmicData.filter(item => 
      item.SCL && item.SCL !== 'x' && !item.SCL.toLowerCase().includes('none')
    ).length;
    
    const activeSDA = pmicData.filter(item => 
      item.SDA && item.SDA !== 'x' && !item.SDA.toLowerCase().includes('none')
    ).length;
    
    // Contar VCC que no son 'none' o vacíos
    const hasPinInfo = pmicData.filter(item => 
      item.VCC && !item.VCC.toLowerCase().includes('none')
    ).length;

    // Contar modelos únicos (usando REFERENCIA como identificador único)
    const uniqueModels = new Set(pmicData.map(item => item.REFERENCIA)).size;

    // Contar referencias por modelo (usando los primeros caracteres de la referencia)
    const modelCounts = pmicData.reduce((acc, item) => {
      // Tomar los primeros 3-4 caracteres como identificador de modelo
      const modelPrefix = item.REFERENCIA.substring(0, 4).trim();
      acc[modelPrefix] = (acc[modelPrefix] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Obtener los 5 modelos más comunes
    const topModels = Object.entries(modelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return {
      totalPmics,
      uniqueModels,
      activeSCL,
      activeSDA,
      hasPinInfo,
      topModels,
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
           <Image 
                      source={{ uri: 'https://bushers.com/wp-content/uploads/2024/07/cropped-logobushersok.jpg' }}  
                      style={styles.headerImage}  
                      resizeMode="contain"
                    />     
          <Database size={32} color="#2563EB" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Base de Datos</Text>
            <Text style={styles.headerSubtitle}>Estadísticas y contenido</Text>
          </View>
        </View>
      </View>

      {/* View Selector */}
      <View style={styles.viewSelector}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            selectedView === 'stats' && styles.viewButtonActive
          ]}
          onPress={() => setSelectedView('stats')}
        >
          <BarChart3 size={16} color={selectedView === 'stats' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.viewButtonText,
            selectedView === 'stats' && styles.viewButtonTextActive
          ]}>
            Estadísticas
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.viewButton,
            selectedView === 'table' && styles.viewButtonActive
          ]}
          onPress={() => setSelectedView('table')}
        >
          <Database size={16} color={selectedView === 'table' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[
            styles.viewButtonText,
            selectedView === 'table' && styles.viewButtonTextActive
          ]}>
            Tabla completa
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {selectedView === 'stats' ? (
          <View style={styles.statsContainer}>
            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
              <View style={[styles.summaryCard, styles.primaryCard]}>
                <Cpu size={24} color="#FFFFFF" />
                <Text style={styles.summaryNumber}>{stats.totalPmics}</Text>
                <Text style={styles.summaryLabel}>Total PMICs</Text>
              </View>
              
              <View style={[styles.summaryCard, styles.secondaryCard]}>
                <TrendingUp size={24} color="#FFFFFF" />
                <Text style={styles.summaryNumber}>{stats.uniqueModels}</Text>
                <Text style={styles.summaryLabel}>Modelos únicos</Text>
              </View>

              <View style={[styles.summaryCard, styles.accentCard]}>
                <Database size={24} color="#FFFFFF" />
                <Text style={styles.summaryNumber}>
                  {stats.hasPinInfo} ({((stats.hasPinInfo / stats.totalPmics) * 100).toFixed(0)}%)
                </Text>
                <Text style={styles.summaryLabel}>Con info de pines</Text>
              </View>
            </View>

            {/* Connection Stats */}
            <View style={styles.connectionStats}>
              <Text style={styles.sectionTitle}>Estado de Conexiones</Text>
              
              <View style={styles.connectionGrid}>
                <View style={styles.connectionCard}>
                  <Text style={styles.connectionTitle}>SCL Activos</Text>
                  <Text style={styles.connectionNumber}>{stats.activeSCL}</Text>
                  <Text style={styles.connectionPercentage}>
                    {((stats.activeSCL / stats.totalPmics) * 100).toFixed(1)}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { 
                        width: `${(stats.activeSCL / stats.totalPmics) * 100}%`,
                        backgroundColor: '#10B981'
                      }
                    ]} />
                  </View>
                </View>

                <View style={styles.connectionCard}>
                  <Text style={styles.connectionTitle}>SDA Activos</Text>
                  <Text style={styles.connectionNumber}>{stats.activeSDA}</Text>
                  <Text style={styles.connectionPercentage}>
                    {((stats.activeSDA / stats.totalPmics) * 100).toFixed(1)}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View style={[
                      styles.progressFill,
                      { 
                        width: `${(stats.activeSDA / stats.totalPmics) * 100}%`,
                        backgroundColor: '#3B82F6'
                      }
                    ]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Top Models */}
            <View style={styles.topModelsSection}>
              <Text style={styles.sectionTitle}>Modelos más comunes</Text>
              
              {stats.topModels.map(([model, count], index) => (
                <View key={model} style={styles.modelItem}>
                  <View style={styles.modelRank}>
                    <Text style={styles.rankNumber}>#{index + 1}</Text>
                  </View>
                  <View style={styles.modelInfo}>
                    <Text style={styles.modelName}>{model}</Text>
                    <Text style={styles.modelCount}>{count} PMICs</Text>
                  </View>
                  <View style={styles.modelBar}>
                    <View style={[
                      styles.modelBarFill,
                      { width: `${(count / stats.topModels[0][1]) * 100}%` }
                    ]} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>Tabla completa de datos</Text>
            
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 3 }]}>REFERENCIA</Text>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>VCC</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>SCL</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>SDA</Text>
            </View>
            
            {/* Table Rows */}
            {pmicData.map((item, index) => {
              const getStatusStyle = (value: string) => {
                if (!value) return { color: '#6B7280', fontStyle: 'italic' };
                const isActive = !value.toLowerCase().includes('none') && value.toLowerCase() !== 'x';
                return {
                  color: isActive ? '#10B981' : '#6B7280',
                  fontWeight: isActive ? '600' : '400',
                  fontStyle: !isActive ? 'italic' : 'normal'
                };
              };
              
              return (
                <View 
                  key={`${item.REFERENCIA}-${index}`} 
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow
                  ]}
                >
                  <Text style={[styles.tableCellText, { flex: 3, fontWeight: '600' }]}>
                    {item.REFERENCIA || 'N/A'}
                  </Text>
                  <Text 
                    style={[
                      styles.tableCellText, 
                      { flex: 2, ...getStatusStyle(item.VCC) }
                    ]}
                  >
                    {item.VCC || 'N/A'}
                  </Text>
                  <Text 
                    style={[
                      styles.tableCellText, 
                      { flex: 1, ...getStatusStyle(item.SCL) }
                    ]}
                  >
                    {item.SCL || 'N/A'}
                  </Text>
                  <Text 
                    style={[
                      styles.tableCellText, 
                      { flex: 1, ...getStatusStyle(item.SDA) }
                    ]}
                  >
                    {item.SDA || 'N/A'}
                  </Text>
                </View>
              );
            })}
          </View>
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
  headerImage: {
    width: 100,
    height:40,
    borderRadius: 8,
    marginRight: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  viewSelector: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  viewButtonActive: {
    backgroundColor: '#2563EB',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  viewButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsContainer: {
    gap: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  primaryCard: {
    backgroundColor: '#2563EB',
  },
  secondaryCard: {
    backgroundColor: '#059669',
  },
  accentCard: {
    backgroundColor: '#8B5CF6',
    shadowColor: '#7C3AED',
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  connectionStats: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  connectionGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  connectionCard: {
    flex: 1,
    alignItems: 'center',
  },
  connectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  connectionNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  connectionPercentage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  topModelsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  modelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  modelRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  modelCount: {
    fontSize: 12,
    color: '#6B7280',
  },
  modelBar: {
    width: 60,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  modelBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  evenRow: {
    backgroundColor: '#FFFFFF',
  },
  oddRow: {
    backgroundColor: '#F8FAFC',
  },
  tableCellText: {
    fontSize: 14,
    color: '#374151',
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