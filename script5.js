const jsonUrl = 'https://makeup-api.herokuapp.com/api/v1/products.json';

// Elementos HTML
const marcaSelect = document.getElementById('marca-select');
const tipoProdutoSelect = document.getElementById('tipo-produto-select');
const searchInput = document.getElementById('search-input');
const ordenarPorSelect = document.getElementById('ordenar-por');
const outputElement = document.getElementById('json-data');
const loadingOverlay = document.getElementById('loading-overlay');





// Vetor para armazenar os produtos
const products = [];

// Função para carregar e exibir os dados JSON
async function loadAndDisplayProducts() {
    try {
        loadingOverlay.style.display = 'flex';

        const response = await fetch(jsonUrl);
        const data = await response.json();

        // Loop através dos produtos no JSON e armazenar em 'products'
        data.forEach(product => {
            
                products.push({
                    name: product.name,
                    brand: product.brand,
                    image_link: product.image_link,
                    price: product.price,
                    product_type: product.product_type
                });
            
        });

        // Preencher o menu de marcas
        const uniqueBrands = new Set(products.map(product => product.brand));
        marcaSelect.innerHTML = '<option value="todos">Todas</option>';
        uniqueBrands.forEach(brand => {
            marcaSelect.innerHTML += `<option value="${brand}">${brand}</option>`;
        });

        // Preencher o menu de tipos de produtos
        const uniqueProductTypes = new Set(products.map(product => product.product_type));
        tipoProdutoSelect.innerHTML = '<option value="todos">Todos</option>';
        uniqueProductTypes.forEach(type => {
            tipoProdutoSelect.innerHTML += `<option value="${type}">${type}</option>`;
        });

        // Exibir todos os produtos na página
        displayProducts();
    } catch (error) {
        console.error('Erro ao carregar ou exibir as informações dos produtos:', error);
    } finally {
        loadingOverlay.style.display = 'none'; // Esconder o overlay de loading
    }
}

// Função para exibir os produtos com a marca, tipo de produto e pesquisa por nome
function displayProducts() {
    loadingOverlay.style.display = 'flex';
    const selectedBrand = marcaSelect.value;
    const selectedProductType = tipoProdutoSelect.value;
    const searchText = searchInput.value.toLowerCase();
    const sortOrder = ordenarPorSelect.value; // Obtém a ordem de classificação selecionada

    // Filtrar e ordenar os produtos de acordo com a marca, tipo de produto, pesquisa por nome e ordenação
    const filteredProducts = products
        .filter(product => {
            const brandMatch = selectedBrand === 'todos' || product.brand === selectedBrand;
            const typeMatch = selectedProductType === 'todos' || product.product_type === selectedProductType;
            const nameMatch = product.name.toLowerCase().includes(searchText);
            return brandMatch && typeMatch && nameMatch;
        })
        .sort((a, b) => {
            if (sortOrder === 'asc-price') {
                return a.price - b.price;
            } else if (sortOrder === 'desc-price') {
                return b.price - a.price;
            } else if (sortOrder === 'asc-name') {
                return a.name.localeCompare(b.name);
            } else if (sortOrder === 'desc-name') {
                return b.name.localeCompare(a.name);
            }
        });

    // Criar uma string formatada com as informações dos produtos filtrados
    let output = '';
    filteredProducts.forEach((product, index) => {
        output += `
        <div class="produtos-container" data-index="${index}" style="width: 48%; margin-bottom: 20px; margin-right: 2%; display: inline-block;">
            <table  class="table" style="border-collapse: separate; border-spacing: 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border-radius: 5px;">
                <tr style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 10px; text-align: center; vertical-align: bottom; border-right: 1px solid #ccc;">
                        <figure class="product-figure">    
                            <img src="${product.image_link}" onerror="javascript:this.src='s.png'" class="product-item" data-index="${index}" width="215px" height="215px" style="border: 1px solid #ccc;">
                        </figure>
                    </td>
                </tr>
                <tr style="border-bottom: 1px solid #ccc;">
                    <td style="padding: 10px; font-size: 35px; color: black" class="product-item">${product.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #ccc;"> 
                    <td>
                        <button style="padding: 10px 20px; background-color: #ccc; border: none; font-size: 16px; cursor: pointer; border-radius: 5px;" class="product-item">${product.brand}</button>
                        <button style="padding: 10px 20px; background-color: #007bff; border: none; color: white; font-size: 16px; cursor: pointer; border-radius: 5px;" class="product-item">R$ ${product.price * 5.5}</button>
                    </td>
                </tr>
            </table>
        </div>
        `;
    });
    

    // Exibir as informações na página
    outputElement.innerHTML = output;
    loadingOverlay.style.display = 'none'
}

// Chamar a função para carregar e exibir os dados JSON
loadAndDisplayProducts();

// Adicionar eventos de mudança aos filtros
marcaSelect.addEventListener('change', displayProducts);
tipoProdutoSelect.addEventListener('change', displayProducts);
searchInput.addEventListener('input', displayProducts);
ordenarPorSelect.addEventListener('change', displayProducts);

