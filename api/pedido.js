export default async function handler(req, res) {

  const numero = req.query.numero;

  if (!numero) {
    return res.status(400).json({ erro: "Número do pedido obrigatório" });
  }

  try {

    const resposta = await fetch(
      `https://api.tray.com.br/orders/${numero}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.TRAY_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const dados = await resposta.json();

    if (!dados || !dados.OrderProducts) {
      return res.status(404).json({ erro: "Pedido não encontrado" });
    }

    const itens = dados.OrderProducts.map(item => ({
      nome: item.Product.name,
      qtd: item.quantity
    }));

    return res.status(200).json({ itens });

  } catch (erro) {
    return res.status(500).json({ erro: "Erro ao consultar Tray" });
  }
}
