Text file: App.tsx
Latest content with line numbers:
1	import { Toaster } from "@/components/ui/sonner";
2	import { TooltipProvider } from "@/components/ui/tooltip";
3	import NotFound from "@/pages/NotFound";
4	import { Route, Switch } from "wouter";
5	import ErrorBoundary from "./components/ErrorBoundary";
6	import { ThemeProvider } from "./contexts/ThemeContext";
7	import Home from "./pages/Home";
8	import ProjectDetail from "./pages/ProjectDetail";
9	
10	function Router() {
11	  // make sure to consider if you need authentication for certain routes
12	  return (
13	    <Switch>
14	      <Route path="/" component={Home} />
15	      <Route path="/project/:id" component={ProjectDetail} />
16	      <Route path="/404" component={NotFound} />
17	      {/* Final fallback route */}
18	      <Route component={NotFound} />
19	    </Switch>
20	  );
21	}
22	
23	// NOTE: About Theme
24	// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
25	//   to keep consistent foreground/background color across components
26	// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook
27	
28	function App() {
29	  return (
30	    <ErrorBoundary>
31	      <ThemeProvider
32	        defaultTheme="light"
33	        // switchable
34	      >
35	        <TooltipProvider>
36	          <Toaster />
37	          <Router />
38	        </TooltipProvider>
39	      </ThemeProvider>
40	    </ErrorBoundary>
41	  );
42	}
43	
44	export default App;
45	
46	