with open("crm/src/pages/Login.jsx", "r", encoding="utf-8") as f:
    text = f.read()

import_replace = """    } catch (err) {
      if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
        setError('Nao foi possivel conectar ao servidor (Offline).');
      } else {
        setError('Credenciais invalidas.');
      }
    }"""

text = text.replace("""    } catch (err) {
      setError('Credenciais invAlidas.');
    }""", import_replace)

with open("crm/src/pages/Login.jsx", "w", encoding="utf-8") as f:
    f.write(text)
