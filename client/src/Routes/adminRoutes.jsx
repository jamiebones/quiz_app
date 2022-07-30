import { Routes, Route } from "react-router-dom";
import { AdminLayout } from "../layout/adminLayout";



export const AdminRoutes = () => {
    <Routes>
    <Route element={<AdminLayout />}>


      <Route index element={<BookList />} />
      <Route path=":id" element={<Book />} />
      <Route path="new" element={<NewBook />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
}


/*<Route path="/books/*" element={<BookRoutes />} />*/