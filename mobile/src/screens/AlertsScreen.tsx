import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { removeAlert, clearAlerts } from '../store/alerts.slice';

const AlertsScreen: React.FC = () => {
    const alerts = useSelector((state: RootState) => state.alerts.alerts);
    const dispatch = useDispatch();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alerts</Text>
                {alerts.length > 0 && (
                    <TouchableOpacity onPress={() => dispatch(clearAlerts())}>
                        <Text style={styles.clearBtn}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>
            {alerts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No alerts at this time.</Text>
                </View>
            ) : (
                <FlatList
                    data={alerts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.alertItem}>
                            <Text style={styles.alertText}>{item.message}</Text>
                            <Text style={styles.alertDate}>
                                {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                            </Text>
                            <TouchableOpacity onPress={() => dispatch(removeAlert(item.id))}>
                                <Text style={styles.dismissBtn}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    clearBtn: {
        color: '#2196F3',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    alertItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    alertText: {
        fontSize: 16,
    },
    alertDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    dismissBtn: {
        color: '#f44336',
        fontSize: 12,
        marginTop: 4,
    },
});

export default AlertsScreen;