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
    "react": "18.2.0",
    "react-native": "0.74.3"
  }
}
`,
    'App.js': `import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, Pressable, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { screens } from './src/data/screens';
import { theme } from './src/theme';
import { RenderElement } from './src/components/RenderElement';

export default function App() {
  const [screenId, setScreenId] = useState(screens[0]?.id);
  const currentScreen = useMemo(() => screens.find((screen) => screen.id === screenId) || screens[0], [screenId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.appBg }}>
      <StatusBar style="dark" />
      <View style={{ flexDirection: 'row', gap: 8, padding: 12 }}>
        {screens.map((screen) => <Pressable key={screen.id} onPress={() => setScreenId(screen.id)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: screen.id === currentScreen?.id ? theme.text : theme.surface }}><Text style={{ color: screen.id === currentScreen?.id ? '#fff' : theme.text, fontWeight: '700' }}>{screen.name}</Text></Pressable>)}
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {(currentScreen?.elements || []).map((item) => <RenderElement key={item.id} item={item} onNavigate={setScreenId} />)}
      </ScrollView>
    </SafeAreaView>
  );
}
`,
    'src/components/RenderElement.js': `import React from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
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

  if (item.type === 'image') return <Image source={{ uri: content }} style={[itemStyle, { minHeight: 180 }]} resizeMode="cover" />;
  if (['input', 'email', 'phone', 'textarea'].includes(item.type)) return <TextInput editable={false} placeholder={content} style={[itemStyle, textStyle, { borderWidth: 1, borderColor: '#cbd5e1' }]} />;
  if (['button', 'appFab'].includes(item.type)) return <Pressable {...boxProps} style={itemStyle}><Text style={[textStyle, { fontWeight: '700', textAlign: 'center' }]}>{content}</Text></Pressable>;

  const [title, ...rest] = content.split('\\n');
  return <Box {...boxProps} style={itemStyle}><Text style={[textStyle, { fontWeight: '800', fontSize: 18 }]}>{title}</Text>{rest.map((line) => <Text key={line} style={[textStyle, { marginTop: 6, color: theme.muted }]}>{line}</Text>)}</Box>;
}
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
    'README.md': `# Generated NoCode Forge Mobile Export (Expo)\n\nMulti-screen Expo app generated from NoCode Forge.\n\n## Run\n1. npm install\n2. npm run start\n3. Press i / a / w\n`,
  };
};

export const generateProjectFiles = (screens, theme) => ({
  web: webFiles(screens, theme),
  mobile: mobileFiles(screens, theme),
});
