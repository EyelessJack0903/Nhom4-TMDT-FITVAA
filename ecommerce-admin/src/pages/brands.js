import BrandForm from "../../components/BrandForm";
import Layout
 from "../../components/Layout";
export default function BrandsPage() {
  return (
    <Layout>
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Brands</h1>
      <BrandForm />
    </div>
    </Layout>
  );
}
