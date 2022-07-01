import { NativeBaseProvider } from "native-base";

import { MyCamera } from "./src/components/MyCamera";

export default function App() {
  return (
    <NativeBaseProvider>
      <MyCamera />
    </NativeBaseProvider>
  );
}
