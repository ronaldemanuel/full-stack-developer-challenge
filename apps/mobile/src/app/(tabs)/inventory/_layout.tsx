import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomHeader from '@/modules/shared/components/custom-header';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="index"
        screenOptions={() => ({
          header: ({ navigation, options }) => {
            return (
              <CustomHeader
                title={options.title as string}
                onMenuPress={() => navigation.toggleDrawer()}
              />
            );
          },
        })}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'ALL',
            title: 'INVENTORY',
          }}
        />
        <Drawer.Screen
          name="weapons" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'WEAPONS',
            title: 'INVENTORY',
          }}
        />
        <Drawer.Screen
          name="apparel" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'APPAREL',
            title: 'INVENTORY',
          }}
        />
        <Drawer.Screen
          name="consumable" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'CONSUMABLES',
            title: 'INVENTORY',
          }}
        />
        <Drawer.Screen
          name="misc" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'MISC',
            title: 'INVENTORY',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
