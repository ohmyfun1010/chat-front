import Chat from "../component/Chat";
import NotFound from "../component/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const RootRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        {/* 모든 다른 경로에 대해 NotFound 컴포넌트 렌더링 */}
        <Route path="*" element={<NotFound />} />{" "}
      </Routes>
    </BrowserRouter>
  );
};

export default RootRoutes;
