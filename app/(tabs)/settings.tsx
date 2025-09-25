import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Linking,
  Image
} from 'react-native';
import {
  Settings,
  Info,
  Phone,
  Globe,
  Mail,
  Zap,
  Database,
  ChevronRight,
} from 'lucide-react-native';

export default function SettingsScreen() {
  const openWebsite = () => {
    Linking.openURL('https://bushers.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+573017578191');
  };

  const openEmail = () => {
    Linking.openURL('mailto:soporte@bushers.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings size={32} color="#2563EB" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Configuración</Text>
            <Text style={styles.headerSubtitle}>Información y contacto</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de la aplicación</Text>
          
          <View style={styles.aboutCard}>
            <View style={styles.aboutIcon}>
              <Zap size={32} color="#2563EB" />
            </View>
            <View style={styles.aboutContent}>
              <Text style={styles.aboutTitle}>Base de Consulta PMIC</Text>
              <Text style={styles.aboutDescription}>
                Aplicación especializada para consultar información técnica de 
                Power Management Integrated Circuits (PMIC) con acceso vía I2C 
                usando protocolos SCL y SDA.
              </Text>
            </View>
          </View>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Database size={20} color="#059669" />
              <Text style={styles.featureText}>
                Base de datos completa de componentes PMIC
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Zap size={20} color="#059669" />
              <Text style={styles.featureText}>
                Filtrado avanzado por modelo y especificaciones
              </Text>
            </View>
            <View style={styles.featureItem}>
              <Info size={20} color="#059669" />
              <Text style={styles.featureText}>
                Información detallada de pines SCL y SDA
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto y soporte</Text>
          
          <View style={styles.contactCard}>
            <View style={styles.companyHeader}>
              <Text style={styles.companyName}>Electrónica Bushers</Text>
              <Text style={styles.companyTagline}>
                Especialistas en componentes electrónicos
              </Text>
            </View>

            <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
              <Globe size={20} color="#2563EB" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Sitio web</Text>
                <Text style={styles.contactValue}>bushers.com</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={openPhone}>
              <Phone size={20} color="#059669" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Teléfono</Text>
                <Text style={styles.contactValue}>+57 301 757 8191</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={openEmail}>
              <Mail size={20} color="#EA580C" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>soporte@bushers.com</Text>
              </View>
              <ChevronRight size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Technical Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información técnica</Text>
          
          <View style={styles.techCard}>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Software utilizado:</Text>
              <Text style={styles.techValue}>TJKJ, QK VGH VGL, Bushers Software</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Protocolo de comunicación:</Text>
              <Text style={styles.techValue}>I2C (Inter-Integrated Circuit)</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techLabel}>Señales:</Text>
              <Text style={styles.techValue}>SCL (Serial Clock), SDA (Serial Data)</Text>
            </View>
          </View>
        </View>

        {/* Version Info */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Versión 1.0.0</Text>
          <Text style={styles.versionSubtext}>
            Desarrollado para Electrónica Bushers
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Electrónica Bushers</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  aboutCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  aboutIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aboutContent: {
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  aboutDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 8,
  },
  featureList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  companyHeader: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  companyTagline: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  techCard: {
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
    gap: 12,
  },
  techItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  techLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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