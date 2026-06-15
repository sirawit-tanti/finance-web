import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getCategories } from "../services/categoryService";
import { getPaginationMeta } from "../utils/pagination";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    loadCategories();
  }, [search, page, perPage]);

  async function loadCategories() {
    const data = await getCategories({ search, page });

    setCategories(data.data);
    setMeta(getPaginationMeta(data));
  }

  return "";
}

export default Categories;
