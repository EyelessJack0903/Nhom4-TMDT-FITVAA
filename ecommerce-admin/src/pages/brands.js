import BrandForm from "../../components/BrandForm";
import Layout
 from "../../components/Layout";
export default function BrandsPage() {
  return (
    <Layout>
    <div>
      <h1 className="text-1xl mb-6">Quản lý thương hiệu</h1>
      <BrandForm />
    </div>
    </Layout>
  );
}