import Layout from "./components/MainLayout/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "./CharkaUI/theme";
import { RecoilRoot } from "recoil";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CommunityId from "./Pages/CommunityPage/CommunityId";
import Submit from "./Pages/CommunityPage/Submit";
import SinglePagePost from "./Pages/CommunityPage/SinglePagePost";
import HomePage from "./components/MainLayout/HomePage";

function App() {
  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        <Router>
          <Layout />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/r/:communityId" element={<CommunityId />} />
            <Route path="/r/:communityId/submit" element={<Submit />} />
            <Route path="/r/:communityId/comments/:postId" element={<SinglePagePost />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default App;
