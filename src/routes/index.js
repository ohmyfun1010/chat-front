
import Home from "../component/Home"
import RandomChat from "../component/RandomChat";
import NotFound from "../component/NotFound";
import CreateGroupChat from "../component/CreateGroupChat";
import FindGroupChat from "../component/FindGroupChat";
import GroupChat from "../component/GroupChat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../css/Common.css"

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/chat/random" element={<RandomChat/>} />
        <Route path="/create/groupchat" element={<CreateGroupChat/>} />
        <Route path="/find/groupchat" element={<FindGroupChat/>} />
        <Route path="/chat/group" element={<GroupChat/>} />
        {/* 모든 다른 경로에 대해 NotFound 컴포넌트 렌더링 */}
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
