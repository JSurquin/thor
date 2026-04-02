export type TemplateId =
  | "react"
  | "next"
  | "vue"
  | "docker"
  | "rails"
  | "ansible"
  | "python"
  | "git"
  | "bash"
  | "go"
  | "node"
  | "terraform"
  | "kubernetes"
  | "sql"
  | "nginx"
  | "makefile"
  | "html"
  | "rust"
  | "typescript"
  | "php";

export interface PlaygroundTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: string;
  files: Record<string, string>;
  entryFile: string;
}

export const TEMPLATES: Record<TemplateId, PlaygroundTemplate> = {
  react: {
    id: "react",
    name: "React",
    description: "Application React avec Vite",
    icon: "⚛️",
    entryFile: "/App.js",
    files: {
      "/App.js": `export default function App() {
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Hello React</h1>
      <p>Modifiez ce fichier pour voir le rendu en direct.</p>
    </div>
  );
}
`,
      "/index.js": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
      "/index.html": `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>
`,
      "/styles.css": `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; }
`,
    },
  },
  next: {
    id: "next",
    name: "Next.js",
    description: "App Router (app/page, app/layout) — aperçu React Sandpack",
    icon: "▲",
    entryFile: "/app/page.jsx",
    files: {
      "/app/layout.jsx": `import "./globals.css";

/* Dans un vrai projet Next, ce layout envelopperait <html> et <body>.
   Ici le rendu est monté dans #root, d’où ce conteneur. */
export default function RootLayout({ children }) {
  return (
    <div className="next-app-root" lang="fr">
      {children}
    </div>
  );
}
`,
      "/app/page.jsx": `export default function Page() {
  return (
    <main style={{ padding: 48, fontFamily: "system-ui" }}>
      <h1>Next.js — App Router</h1>
      <p>
        Modifiez <code>app/page.jsx</code> (et au besoin <code>app/layout.jsx</code>).
      </p>
    </main>
  );
}
`,
      "/app/globals.css": `* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.next-app-root {
  min-height: 100%;
}
`,
      "/index.js": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RootLayout from "./app/layout.jsx";
import Page from "./app/page.jsx";

/* Point d’entrée pour l’aperçu : compose layout + page comme Next.js */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootLayout>
      <Page />
    </RootLayout>
  </StrictMode>
);
`,
      "/index.html": `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Next.js — Playground</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.js"></script>
  </body>
</html>
`,
    },
  },
  vue: {
    id: "vue",
    name: "Vue 3",
    description: "Vue 3 (Composition API) — aperçu Sandpack",
    icon: "💚",
    entryFile: "/src/App.vue",
    files: {
      "/src/App.vue": `<template>
  <div style="padding: 24px; font-family: system-ui">
    <h1>{{ titre }}</h1>
    <p>Modifiez <code>src/App.vue</code> pour voir le rendu.</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
const titre = ref("Hello Vue");
</script>
`,
      "/src/main.js": `import { createApp } from "vue";
import App from "./App.vue";
import "./styles.css";

createApp(App).mount("#app");
`,
      "/src/styles.css": `* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
`,
    },
  },
  docker: {
    id: "docker",
    name: "Docker",
    description: "Dockerfile et docker-compose",
    icon: "🐳",
    entryFile: "/Dockerfile",
    files: {
      "/Dockerfile": `# Image Node pour une app front
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
`,
      "/docker-compose.yml": `version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
`,
      "/.dockerignore": `node_modules
.next
.git
*.md
`,
      "/README.md": `# Projet Docker

Lancement :
\`\`\`bash
docker compose up --build
\`\`\`
`,
    },
  },
  rails: {
    id: "rails",
    name: "Rails",
    description: "Structure Ruby on Rails",
    icon: "🛤️",
    entryFile: "/app/controllers/application_controller.rb",
    files: {
      "/Gemfile": `source "https://rubygems.org"

gem "rails", "~> 7.2"
gem "sqlite3"
gem "puma"
gem "sassc-rails"
`,
      "/app/controllers/application_controller.rb": `# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :set_hello

  private

  def set_hello
    @message = "Hello from Rails"
  end
end
`,
      "/config/routes.rb": `# frozen_string_literal: true

Rails.application.routes.draw do
  root "home#index"
end
`,
      "/app/views/layouts/application.html.erb": `<!DOCTYPE html>
<html>
  <head>
    <title>Rails App</title>
    <%= csrf_meta_tags %>
  </head>
  <body>
    <%= yield %>
  </body>
</html>
`,
      "/README.md": `# Rails

\`\`\`bash
bundle install
rails server
\`\`\`
`,
    },
  },
  ansible: {
    id: "ansible",
    name: "Ansible",
    description: "Playbook et inventaire Ansible",
    icon: "📦",
    entryFile: "/playbook.yml",
    files: {
      "/playbook.yml": `---
- name: Configuration serveur
  hosts: all
  become: yes
  tasks:
    - name: Installer les paquets
      apt:
        name:
          - nginx
          - python3-pip
        state: present
        update_cache: yes
`,
      "/inventory.ini": `[webservers]
server1 ansible_host=192.168.1.10
server2 ansible_host=192.168.1.11

[all_vars]
ansible_user=deploy
ansible_ssh_private_key_file=~/.ssh/deploy_key
`,
      "/ansible.cfg": `[defaults]
inventory = inventory.ini
remote_user = deploy
host_key_checking = False
`,
      "/README.md": `# Ansible

\`\`\`bash
ansible-playbook playbook.yml
\`\`\`
`,
    },
  },
  python: {
    id: "python",
    name: "Python",
    description: "Script Python avec requirements",
    icon: "🐍",
    entryFile: "/main.py",
    files: {
      "/main.py": `def main():
    print("Hello from Python!")

if __name__ == "__main__":
    main()
`,
      "/requirements.txt": `requests>=2.28.0
python-dotenv>=1.0.0
`,
      "/README.md": `# Python

\`\`\`bash
pip install -r requirements.txt
python main.py
\`\`\`
`,
    },
  },
  git: {
    id: "git",
    name: "Git",
    description: "Config Git et hooks",
    icon: "📂",
    entryFile: "/.gitignore",
    files: {
      "/.gitignore": `node_modules/
.env
.env.local
*.log
.DS_Store
dist/
build/
.next/
`,
      "/.gitattributes": `* text=auto eol=lf
*.{cmd,[cC][mM][dD]} text eol=crlf
*.{bat,[bB][aA][tT]} text eol=crlf
`,
      "/.gitconfig.example": `[user]
    name = Votre Nom
    email = vous@exemple.com

[core]
    autocrlf = input
    editor = code --wait

[init]
    defaultBranch = main
`,
      "/README.md": `# Git

Commandes utiles :
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
\`\`\`
`,
    },
  },
  bash: {
    id: "bash",
    name: "Bash",
    description: "Scripts shell Bash",
    icon: "🐚",
    entryFile: "/script.sh",
    files: {
      "/script.sh": `#!/usr/bin/env bash
set -euo pipefail

echo "Hello from Bash!"
`,
      "/README.md": `# Bash

\`\`\`bash
chmod +x script.sh
./script.sh
\`\`\`
`,
    },
  },
  go: {
    id: "go",
    name: "Go",
    description: "Application Go",
    icon: "🐹",
    entryFile: "/main.go",
    files: {
      "/main.go": `package main

import "fmt"

func main() {
	fmt.Println("Hello from Go!")
}
`,
      "/go.mod": `module app

go 1.21
`,
      "/README.md": `# Go

\`\`\`bash
go run main.go
\`\`\`
`,
    },
  },
  node: {
    id: "node",
    name: "Node.js",
    description: "Application Node.js simple",
    icon: "🟢",
    entryFile: "/index.js",
    files: {
      "/index.js": `console.log("Hello from Node.js!");
`,
      "/package.json": `{
  "name": "app",
  "version": "1.0.0",
  "type": "module"
}
`,
      "/README.md": `# Node.js

\`\`\`bash
node index.js
\`\`\`
`,
    },
  },
  terraform: {
    id: "terraform",
    name: "Terraform",
    description: "Infra as Code Terraform",
    icon: "🏗️",
    entryFile: "/main.tf",
    files: {
      "/main.tf": `terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

resource "aws_instance" "app" {
  ami           = var.ami_id
  instance_type = var.instance_type
}
`,
      "/variables.tf": `variable "ami_id" {
  description = "AMI ID"
  type        = string
}

variable "instance_type" {
  default     = "t3.micro"
  description = "Instance type"
  type        = string
}
`,
      "/README.md": `# Terraform

\`\`\`bash
terraform init
terraform plan
terraform apply
\`\`\`
`,
    },
  },
  kubernetes: {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Manifests Kubernetes",
    icon: "☸️",
    entryFile: "/deployment.yaml",
    files: {
      "/deployment.yaml": `apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
        - name: app
          image: app:latest
          ports:
            - containerPort: 3000
`,
      "/service.yaml": `apiVersion: v1
kind: Service
metadata:
  name: app
spec:
  selector:
    app: app
  ports:
    - port: 80
      targetPort: 3000
  type: LoadBalancer
`,
      "/README.md": `# Kubernetes

\`\`\`bash
kubectl apply -f .
\`\`\`
`,
    },
  },
  sql: {
    id: "sql",
    name: "SQL",
    description: "Schéma et requêtes SQL",
    icon: "🗄️",
    entryFile: "/schema.sql",
    files: {
      "/schema.sql": `-- Schéma principal
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255),
  body TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`,
      "/seed.sql": `INSERT INTO users (email) VALUES
  ('alice@example.com'),
  ('bob@example.com');
`,
      "/README.md": `# SQL

\`\`\`bash
psql -f schema.sql
psql -f seed.sql
\`\`\`
`,
    },
  },
  nginx: {
    id: "nginx",
    name: "Nginx",
    description: "Configuration Nginx",
    icon: "🌐",
    entryFile: "/nginx.conf",
    files: {
      "/nginx.conf": `server {
    listen 80;
    server_name localhost;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
`,
      "/README.md": `# Nginx

Test de config : \`nginx -t\`
`,
    },
  },
  makefile: {
    id: "makefile",
    name: "Makefile",
    description: "Makefile et tâches",
    icon: "⚙️",
    entryFile: "/Makefile",
    files: {
      "/Makefile": `.PHONY: build run clean

build:
	go build -o bin/app .

run: build
	./bin/app

clean:
	rm -rf bin/
`,
      "/README.md": `# Makefile

\`\`\`bash
make build
make run
\`\`\`
`,
    },
  },
  html: {
    id: "html",
    name: "HTML",
    description: "Page HTML / CSS statique",
    icon: "📄",
    entryFile: "/index.html",
    files: {
      "/index.html": `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Ma page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello HTML</h1>
  <p>Modifiez index.html et style.css.</p>
</body>
</html>
`,
      "/style.css": `* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; padding: 2rem; }
h1 { color: #333; }
`,
      "/README.md": `# HTML

Ouvrez index.html dans un navigateur.
`,
    },
  },
  rust: {
    id: "rust",
    name: "Rust",
    description: "Projet Rust",
    icon: "🦀",
    entryFile: "/src/main.rs",
    files: {
      "/src/main.rs": `fn main() {
    println!("Hello from Rust!");
}
`,
      "/Cargo.toml": `[package]
name = "app"
version = "0.1.0"
edition = "2021"

[dependencies]
`,
      "/README.md": `# Rust

\`\`\`bash
cargo run
\`\`\`
`,
    },
  },
  typescript: {
    id: "typescript",
    name: "TypeScript",
    description: "Node avec TypeScript",
    icon: "📘",
    entryFile: "/src/index.ts",
    files: {
      "/src/index.ts": `console.log("Hello from TypeScript!");
`,
      "/package.json": `{
  "name": "app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
`,
      "/tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "outDir": "dist",
    "strict": true
  },
  "include": ["src/**/*"]
}
`,
      "/README.md": `# TypeScript

\`\`\`bash
npm install
npm run build && npm start
\`\`\`
`,
    },
  },
  php: {
    id: "php",
    name: "PHP",
    description: "Script PHP",
    icon: "🐘",
    entryFile: "/index.php",
    files: {
      "/index.php": `<?php
echo "Hello from PHP!\n";
`,
      "/README.md": `# PHP

\`\`\`bash
php index.php
# ou avec serveur : php -S localhost:8000
\`\`\`
`,
    },
  },
};

export const TEMPLATE_IDS = Object.keys(TEMPLATES) as TemplateId[];
