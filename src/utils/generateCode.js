const normalizeScreens = (screens) => {
  if (Array.isArray(screens) && screens[0]?.elements) return screens;
  if (Array.isArray(screens)) return [{ id: 'screen-home', name: 'Accueil', elements: screens }];
  return [{ id: 'screen-home', name: 'Accueil', elements: [] }];
};

const webFiles = (screensInput, theme) => {
  const screens = normalizeScreens(screensInput);
  const serializedScreens = JSON.stringify(screens, null, 2);
  const serializedThemeVars = JSON.stringify(theme?.vars || {}, null, 2);

  return {
    'src/App.jsx': `import React, { useMemo, useState } from 'react';
import { screens } from './data/screens';
import { RenderElement } from './components/RenderElement';
import { themeVars } from './theme';

export default function App() {
  const [screenId, setScreenId] = useState(screens[0]?.id);
  const currentScreen = useMemo(() => screens.find((screen) => screen.id === screenId) || screens[0], [screenId]);

  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: 'var(--ncf-app-bg)', ...themeVars }}>
      <div className="mx-auto w-full max-w-md rounded-[2rem] bg-white/80 p-4 shadow-2xl">
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {screens.map((screen) => (
            <button key={screen.id} onClick={() => setScreenId(screen.id)} className={\`shrink-0 rounded-full px-3 py-2 text-sm font-semibold \${screen.id === currentScreen?.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}\`}>
              {screen.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {(currentScreen?.elements || []).map((item) => (
            <RenderElement key={item.id} item={item} onNavigate={setScreenId} />
          ))}
        </div>
      </div>
    </main>
  );
}
`,
    'src/components/RenderElement.jsx': `import React from 'react';

const getClasses = (item) => {
  const p = item.props || {};
  return [p.textColor, p.backgroundColor, p.padding, p.radius, p.fontSize, item.className]
    .filter(Boolean)
    .join(' ')
    .trim();
};

const parseSize = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number.parseInt(value, 10);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

const linesOf = (content) => (content || '').split('\\n').filter(Boolean);

export function RenderElement({ item, onNavigate }) {
  const className = [getClasses(item), 'min-w-0 max-w-full break-words'].filter(Boolean).join(' ');
  const content = item.content || '';
  const width = parseSize(item.props?.width);
  const height = parseSize(item.props?.height);
  const boxStyle = { width: width ? width + 'px' : undefined, height: height ? height + 'px' : undefined };
  const clickProps = item.props?.targetScreen ? { onClick: () => onNavigate?.(item.props.targetScreen), className: className + ' cursor-pointer' } : { className };

  switch (item.type) {
    case 'button':
    case 'appFab':
      return <button style={boxStyle} {...clickProps}>{content}</button>;
    case 'image':
      return <img style={boxStyle} src={content} alt="app visual" className={className + ' object-cover'} />;
    case 'input':
    case 'email':
    case 'phone':
      return <input style={boxStyle} placeholder={content} className={className + ' border border-slate-300'} readOnly />;
    case 'textarea':
      return <textarea style={boxStyle} placeholder={content} className={className + ' border border-slate-300'} readOnly />;
    case 'checkbox':
      return <label style={boxStyle} className={className + ' flex items-center gap-3'}><input type="checkbox" readOnly />{content}</label>;
    case 'select': {
      const [placeholder, ...options] = linesOf(content);
      return <select style={boxStyle} className={className + ' border border-slate-300'} value="" onChange={() => {}}><option value="">{placeholder || 'Choisir'}</option>{options.map((option) => <option key={option}>{option}</option>)}</select>;
    }
    case 'appTopBar': {
      const [hello, title] = content.split('\\n');
      return <header style={boxStyle} className={className + ' flex items-center justify-between shadow-sm'}><div><p className="text-sm opacity-80">{hello}</p><h2 className="text-xl font-black">{title}</h2></div><div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 font-bold">A</div></header>;
    }
    case 'appBottomNav': {
      const items = linesOf(content);
      return <nav style={boxStyle} className={className + ' border shadow-sm'}><div className="grid gap-2" style={{ gridTemplateColumns: \`repeat(\${Math.max(items.length, 1)}, minmax(0, 1fr))\` }}>{items.map((label, i) => <span key={label} className={\`rounded-2xl px-2 py-2 text-center text-xs font-semibold \${i === 0 ? 'bg-slate-900 text-white' : 'text-slate-500'}\`}>{label}</span>)}</div></nav>;
    }
    case 'appListItem':
    case 'orderCard':
    case 'notificationCard': {
      const [title, text, meta] = content.split('\\n');
      return <div style={boxStyle} {...clickProps}><p className="font-bold">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p><p className="mt-2 text-xs font-semibold text-slate-400">{meta}</p></div>;
    }
    case 'productCard': {
      const [name, price, status] = content.split('\\n');
      return <div style={boxStyle} {...clickProps}><div className="mb-4 h-28 rounded-2xl bg-slate-100" /><p className="font-black">{name}</p><p className="mt-2 font-bold text-slate-700">{price}</p><p className="text-sm text-slate-500">{status}</p></div>;
    }
    case 'userProfile': {
      const [name, role, email] = content.split('\\n');
      return <div style={boxStyle} className={className + ' flex items-center gap-4'}><div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 font-bold text-white">{(name || 'U').slice(0, 1)}</div><div><p className="font-black">{name}</p><p className="text-sm text-slate-500">{role}</p><p className="text-xs text-slate-400">{email}</p></div></div>;
    }
    case 'metricCard': {
      const [label, value, trend] = content.split('\\n');
      return <div style={boxStyle} className={className + ' border shadow-sm'}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-black">{value}</p><p className="mt-2 text-sm font-bold text-emerald-600">{trend}</p></div>;
    }
    case 'hero': {
      const [title, subtitle] = content.split('\\n');
      return <section style={boxStyle} className={className}><h1 className="text-4xl font-black">{title}</h1><p className="mt-3 text-slate-500">{subtitle}</p></section>;
    }
    case 'card':
    case 'appActionCard':
    case 'cta':
    case 'quote':
    case 'pricing':
    case 'testimonial':
    case 'section': {
      const [title, ...rest] = content.split('\\n');
      return <div style={boxStyle} {...clickProps}><p className="text-lg font-bold">{title}</p>{rest.map((line) => <p key={line} className="mt-2 text-sm text-slate-500">{line}</p>)}</div>;
    }
    case 'stats':
    case 'features':
    case 'team':
    case 'faq':
    case 'list':
      return <div style={boxStyle} className={className}>{linesOf(content).map((line) => <p key={line} className="py-1">{line}</p>)}</div>;
    case 'gallery':
      return <div style={boxStyle} className={className + ' grid gap-3'}>{linesOf(content).map((src) => <img key={src} src={src} alt="gallery" className="h-32 w-full rounded-2xl object-cover" />)}</div>;
    case 'divider':
    case 'spacer':
      return <div style={boxStyle} className={className} />;
    default:
      return <div style={boxStyle} className={className}>{content}</div>;
  }
}
`,
    'src/data/screens.js': `export const screens = ${serializedScreens};\n`,
    'src/theme.js': `export const themeVars = ${serializedThemeVars};\n`,
    'README.md': `# Generated NoCode Forge Web App\n\nThis export contains a React + Tailwind multi-screen app generated from NoCode Forge.\n`,
  };
};

const mobileFiles = (screensInput, theme) => {
  const screens = normalizeScreens(screensInput);
  const serializedScreens = JSON.stringify(screens, null, 2);
  const vars = theme?.vars || {};

  return {
    'package.json': `{
  "name": "nocode-forge-mobile-export",
  "version": "1.0.0",
  "private": true,
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~51.0.0",
    "expo-status-bar": "~1.12.1",
    "react-dom": "18.2.0",
    "react": "18.2.0",
    "react-native": "0.74.5",
    "react-native-web": "~0.19.10"
  }
}
`,
    'App.js': `import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { screens } from './src/data/screens';
import { theme } from './src/theme';
import { RenderElement } from './src/components/RenderElement';

export default function App() {
  const [screenId, setScreenId] = useState(screens[0]?.id);
  const currentScreen = useMemo(() => screens.find((screen) => screen.id === screenId) || screens[0], [screenId]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.appBg }]}>
      <StatusBar style="dark" />
      <View style={styles.phoneShell}>
        <View style={styles.handle} />
        <Text style={[styles.appTitle, { color: theme.text }]}>Mon application</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {screens.map((screen) => {
            const active = screen.id === currentScreen?.id;
            return (
              <Pressable key={screen.id} onPress={() => setScreenId(screen.id)} style={[styles.tab, { backgroundColor: active ? theme.text : theme.surface }]}>
                <Text style={{ color: active ? '#fff' : theme.text, fontWeight: '800' }}>{screen.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {(currentScreen?.elements || []).map((item) => <RenderElement key={item.id} item={item} onNavigate={setScreenId} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  phoneShell: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  handle: { alignSelf: 'center', width: 48, height: 5, borderRadius: 999, backgroundColor: '#94a3b8', marginBottom: 12 },
  appTitle: { fontSize: 22, fontWeight: '900', marginBottom: 12 },
  tabs: { gap: 8, paddingBottom: 2 },
  tab: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
});
`,
    'src/components/RenderElement.js': `import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';
import { getItemStyle, getTextStyle } from '../utils/styleParsers';

const linesOf = (content) => (content || '').split('\\n').filter(Boolean);

export function RenderElement({ item, onNavigate }) {
  const content = item.content || '';
  const itemStyle = getItemStyle(item, theme);
  const textStyle = getTextStyle(item, theme);
  const target = item.props?.targetScreen;
  const Box = target ? Pressable : View;
  const boxProps = target ? { onPress: () => onNavigate?.(target) } : {};
  const cardStyle = [styles.card, itemStyle];

  if (item.type === 'image') return <Image source={{ uri: content }} style={[itemStyle, styles.image]} resizeMode="cover" />;
  if (['input', 'email', 'phone', 'textarea'].includes(item.type)) return <TextInput editable={false} placeholder={content} style={[styles.input, itemStyle, textStyle]} />;
  if (['button', 'appFab'].includes(item.type)) return <Pressable {...boxProps} style={[styles.button, itemStyle]}><Text style={[textStyle, styles.buttonText]}>{content}</Text></Pressable>;

  const [title, ...rest] = content.split('\\n');

  if (item.type === 'appTopBar') {
    const [hello, screenTitle] = content.split('\\n');
    return <View style={[styles.topBar, itemStyle]}><View><Text style={styles.topBarSmall}>{hello}</Text><Text style={styles.topBarTitle}>{screenTitle}</Text></View><View style={styles.avatar}><Text style={styles.avatarText}>{(hello || 'A').slice(0, 1)}</Text></View></View>;
  }

  if (item.type === 'appBottomNav') {
    const items = linesOf(content);
    return <View style={[styles.bottomNav, itemStyle]}>{items.map((label, index) => <View key={label} style={[styles.navItem, index === 0 && { backgroundColor: theme.accent }]}><Text style={[styles.navText, index === 0 && { color: '#fff' }]}>{label}</Text></View>)}</View>;
  }

  if (item.type === 'productCard') {
    const [name, price, status] = content.split('\\n');
    return <Box {...boxProps} style={cardStyle}><View style={styles.productImage} /><Text style={[textStyle, styles.title]}>{name}</Text><View style={styles.row}><Text style={styles.price}>{price}</Text><Text style={styles.pill}>{status}</Text></View></Box>;
  }

  if (item.type === 'orderCard') {
    const [order, status, meta] = content.split('\\n');
    return <Box {...boxProps} style={cardStyle}><View style={styles.row}><Text style={[textStyle, styles.title]}>{order}</Text><Text style={styles.successPill}>{status}</Text></View><Text style={styles.muted}>{meta}</Text></Box>;
  }

  if (item.type === 'notificationCard') {
    const [notifTitle, message, time] = content.split('\\n');
    return <Box {...boxProps} style={[cardStyle, styles.notification]}><Text style={[textStyle, styles.title]}>{notifTitle}</Text><Text style={styles.muted}>{message}</Text><Text style={styles.accentText}>{time}</Text></Box>;
  }

  if (item.type === 'userProfile') {
    const [name, role, email] = content.split('\\n');
    return <View style={[cardStyle, styles.profile]}><View style={styles.bigAvatar}><Text style={styles.avatarText}>{(name || 'U').slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={[textStyle, styles.title]}>{name}</Text><Text style={styles.muted}>{role}</Text><Text style={styles.smallMuted}>{email}</Text></View></View>;
  }

  if (item.type === 'metricCard') {
    const [label, value, trend] = content.split('\\n');
    return <View style={cardStyle}><Text style={styles.muted}>{label}</Text><Text style={[textStyle, styles.metric]}>{value}</Text><Text style={styles.goodTrend}>{trend}</Text></View>;
  }

  if (item.type === 'appListItem') {
    const [itemTitle, status, meta] = content.split('\\n');
    return <Box {...boxProps} style={[cardStyle, styles.listItem]}><View style={styles.avatar}><Text style={styles.avatarText}>{(itemTitle || 'A').slice(0, 1)}</Text></View><View style={{ flex: 1 }}><Text style={[textStyle, styles.title]}>{itemTitle}</Text><Text style={styles.muted}>{status}</Text></View><Text style={styles.pill}>{meta}</Text></Box>;
  }

  return <Box {...boxProps} style={cardStyle}><Text style={[textStyle, styles.title]}>{title}</Text>{rest.map((line) => <Text key={line} style={styles.muted}>{line}</Text>)}</Box>;
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  title: { fontWeight: '900', fontSize: 18 },
  muted: { marginTop: 6, color: theme.muted, lineHeight: 21 },
  smallMuted: { marginTop: 4, color: theme.muted, fontSize: 12 },
  image: { minHeight: 180, borderRadius: 24 },
  input: { borderWidth: 1, borderColor: '#cbd5e1' },
  button: { alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontWeight: '900', textAlign: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBarSmall: { color: 'rgba(255,255,255,0.75)', fontWeight: '700' },
  topBarTitle: { color: '#fff', fontWeight: '900', fontSize: 22, marginTop: 2 },
  avatar: { width: 42, height: 42, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15,23,42,0.12)' },
  bigAvatar: { width: 64, height: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.accent },
  avatarText: { color: '#fff', fontWeight: '900' },
  bottomNav: { flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
  navItem: { flex: 1, alignItems: 'center', borderRadius: 18, paddingVertical: 10 },
  navText: { color: theme.muted, fontWeight: '800', fontSize: 12 },
  productImage: { height: 120, borderRadius: 22, backgroundColor: theme.surfaceSoft, marginBottom: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  price: { color: theme.accentStrong, fontWeight: '900', fontSize: 17 },
  pill: { overflow: 'hidden', borderRadius: 999, backgroundColor: theme.surfaceSoft, paddingHorizontal: 10, paddingVertical: 5, color: theme.muted, fontWeight: '800', fontSize: 12 },
  successPill: { overflow: 'hidden', borderRadius: 999, backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 5, color: '#166534', fontWeight: '800', fontSize: 12 },
  notification: { borderLeftWidth: 4, borderLeftColor: theme.accent },
  accentText: { marginTop: 10, color: theme.accentStrong, fontWeight: '900', fontSize: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metric: { marginTop: 6, fontWeight: '900', fontSize: 34 },
  goodTrend: { marginTop: 6, color: '#059669', fontWeight: '900' },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
`,
    'src/utils/styleParsers.js': `const parseSpacing = (value) => {
  if (!value) return {};
  if (value === 'p-0') return { padding: 0 };
  if (value === 'p-2') return { padding: 8 };
  if (value === 'p-4') return { padding: 16 };
  if (value === 'p-5') return { padding: 20 };
  if (value === 'p-6') return { padding: 24 };
  if (value === 'p-8') return { padding: 32 };
  if (value === 'px-4 py-2') return { paddingHorizontal: 16, paddingVertical: 8 };
  if (value === 'px-4 py-3') return { paddingHorizontal: 16, paddingVertical: 12 };
  if (value === 'px-6 py-3') return { paddingHorizontal: 24, paddingVertical: 12 };
  if (value === 'px-6 py-4') return { paddingHorizontal: 24, paddingVertical: 16 };
  if (value === 'px-6 py-5') return { paddingHorizontal: 24, paddingVertical: 20 };
  return {};
};

const parseRadius = (value) => {
  if (value === 'rounded-none') return 0;
  if (value === 'rounded-lg') return 12;
  if (value === 'rounded-xl') return 16;
  if (value === 'rounded-2xl') return 20;
  if (value === 'rounded-3xl') return 28;
  return 16;
};

const parseFontSize = (value) => {
  if (value === 'text-sm') return 14;
  if (value === 'text-base') return 16;
  if (value === 'text-lg') return 18;
  if (value === 'text-xl') return 20;
  if (value === 'text-2xl') return 24;
  return 16;
};

const colorFromToken = (token, theme) => {
  if (!token) return undefined;
  if (token === 'text-white') return '#ffffff';
  if (token === 'text-slate-900') return '#0f172a';
  if (token === 'text-slate-500') return '#64748b';
  if (token.includes('--ncf-text')) return theme.text;
  if (token.includes('--ncf-muted')) return theme.muted;
  return undefined;
};

const backgroundFromToken = (token, theme) => {
  if (!token) return undefined;
  if (token === 'bg-white') return '#ffffff';
  if (token === 'bg-slate-100') return '#f1f5f9';
  if (token === 'bg-slate-900') return '#0f172a';
  if (token.includes('--ncf-surface-soft')) return theme.surfaceSoft;
  if (token.includes('--ncf-surface')) return theme.surface;
  if (token.includes('--ncf-accent-strong')) return theme.accentStrong;
  if (token.includes('--ncf-accent')) return theme.accent;
  return undefined;
};

export const getItemStyle = (item, theme) => {
  const props = item.props || {};
  return {
    ...parseSpacing(props.padding),
    borderRadius: parseRadius(props.radius),
    backgroundColor: backgroundFromToken(props.backgroundColor, theme),
    width: typeof props.width === 'number' ? props.width : undefined,
    minHeight: typeof props.height === 'number' ? props.height : undefined,
  };
};

export const getTextStyle = (item, theme) => {
  const props = item.props || {};
  return { color: colorFromToken(props.textColor, theme) || theme.text, fontSize: parseFontSize(props.fontSize) };
};
`,
    'src/data/screens.js': `export const screens = ${serializedScreens};\n`,
    'src/theme.js': `export const theme = {
  appBg: '${vars['--ncf-app-bg'] || '#e2e8f0'}',
  surface: '${vars['--ncf-surface'] || '#ffffff'}',
  surfaceSoft: '${vars['--ncf-surface-soft'] || '#f8fafc'}',
  text: '${vars['--ncf-text'] || '#0f172a'}',
  muted: '${vars['--ncf-muted'] || '#475569'}',
  accent: '${vars['--ncf-accent'] || '#0f6cbd'}',
  accentStrong: '${vars['--ncf-accent-strong'] || '#0b4c84'}',
};
`,
    'README.md': `# Application mobile exportee depuis NoCode Forge

Ce dossier contient une application mobile Expo generee par NoCode Forge.

## Lancer le projet

1. Installer les dependances :

\`\`\`bash
npm install
\`\`\`

2. Demarrer Expo :

\`\`\`bash
npm run start
\`\`\`

3. Choisir la cible :

- appuie sur \`a\` pour Android
- appuie sur \`i\` pour iPhone / iOS
- appuie sur \`w\` pour tester dans le navigateur

## Structure

- \`App.js\` : navigation entre les ecrans
- \`src/data/screens.js\` : tous les ecrans exportes
- \`src/components/RenderElement.js\` : rendu des composants
- \`src/utils/styleParsers.js\` : conversion des styles
- \`src/theme.js\` : couleurs du theme

## Notes

Les boutons et cartes qui ont une destination dans NoCode Forge changent d'ecran dans cette app Expo.
`,
  };
};

export const generateProjectFiles = (screens, theme) => ({
  web: webFiles(screens, theme),
  mobile: mobileFiles(screens, theme),
});
