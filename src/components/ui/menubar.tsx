import React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from "@/components/ui/menubar";
import { SidebarTrigger } from "@/components/ui/sidebar"; // botão hambúrguer
import { useUserData } from "@/hooks/useUserData";
import Image from "next/image"; // ou <img src=...> se não usar Next.js

const Header: React.FC = () => {
  const { user } = useUserData(); // seu hook de dados do usuário

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm flex items-center justify-between h-16 px-4 w-full">
      {/* Logo e botão de abrir a sidebar */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="relative z-[60]" />
        <Image
          src="/logo-subpi.svg"
          alt="Logo Subprefeitura"
          width={100}
          height={40}
          className="h-10 hidden md:block"
        />
      </div>

      {/* Menu suspenso do usuário */}
      <Menubar className="ml-auto bg-transparent border-none">
        <MenubarMenu>
          <MenubarTrigger className="relative z-[60] px-3 py-2 rounded-md hover:bg-gray-100 transition">
            {user?.nome_completo || "Usuário"}
          </MenubarTrigger>
          <MenubarContent align="end" className="z-[70]">
            <MenubarItem onClick={() => console.log("Editar perfil")}>
              Editar perfil
            </MenubarItem>
            <MenubarItem onClick={() => console.log("Notificações")}>
              Notificações
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={() => console.log("Sair")}>
              Sair
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  );
};

export default Header;
