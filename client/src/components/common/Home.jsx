import React from "react";
import { Layout, Popover, Avatar, Button, Modal } from "antd";
import { HeaderCustom } from "./Header";
import { HomeContent } from "../HomeContent";


function Home() {



    return (
        <Layout>
            <HeaderCustom />
            <HomeContent />
        </Layout>
    );
}

export default Home;