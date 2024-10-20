import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductPage(){
    const router = useRouter();
    const [productInfo, setProductInfo] = useState();
    const {id} = router.query;
    useEffect(() => {
        if (!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response =>{
            setProductInfo(response.data);
        })
    },[id])
    function goBack(){
        router.push('/products');
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Bạn có muốn xóa sản phẩm &nbsp;"{productInfo?.title}"?</h1>
            <div className="flex gap-2 justify-center">
                <button className="btn-red" onClick={deleteProduct}>Xóa sản phẩm</button>
                <button  className="btn-default" onClick={goBack}>Quay lại</button>
            </div>
        </Layout>
    );
}