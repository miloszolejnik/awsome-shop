import { db } from '@/server';
import placeholder from '@/public/placeholder.jpg';
import { DataTable } from './data-table';
import { columns } from './columns';

export default async function ProductsPage() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: {
          variantImages: true,
          variantTags: true,
        },
      },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });
  if (!products) {
    throw new Error('Products not found');
  }

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      image: placeholder.src,
      variants: [],
    };
  });
  if (!dataTable) {
    throw new Error('Products not found');
  }
  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
