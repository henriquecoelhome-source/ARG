# conhecer-verdade

Site das 8 fases do ARG. É um site estático, sem servidor.

## Publicar no Render
1. Suba esta pasta para um repositório (GitHub).
2. No Render: **New → Static Site**, escolha o repositório.
3. Nome do serviço: `conhecer-verdade` (vira conhecer-verdade.onrender.com).
4. Build command: vazio. **Publish directory: `public`**.

## Fase 5 (áudio)
Coloque o seu áudio com o espectrograma em `public/assets/mensagem.wav`.
Use WAV (ou FLAC). MP3/OGG comprimem e estragam o espectrograma.
Para mudar o nome ou o caminho, edite `AUDIO` em `config.js`.

## Editar respostas, textos ou coordenadas
Edite `config.js` e rode `node build.js`. Isso regenera `public/index.html`.
As respostas ficam criptografadas: cada fase só abre com a resposta da anterior,
então nem ler o código-fonte da página entrega nada.
A comparação ignora maiúsculas, acentos, pontuação e espaços.

## Testar do zero
No console do navegador: `localStorage.clear()` e recarregue.
O progresso do jogador fica salvo no próprio navegador dele.
