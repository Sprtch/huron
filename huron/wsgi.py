from huron import create_app

app = create_app('huron.settings.ProdConfig')

if __name__ == "__main__":
    app.run()
