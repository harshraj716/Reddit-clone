import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Flex,
  MenuDivider,
  useToast,
  Text,
  Image,
} from "@chakra-ui/react";
import { VscAccount } from "react-icons/vsc";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { CgProfile } from "react-icons/cg";
import { signOut } from "firebase/auth";
import { MdOutlineLogin } from "react-icons/md";
import { auth } from "../../../Firebase/firebaseConfig";
import showToast from "../../../CharkaUI/toastUtils";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../AuthModalAtom/AuthmodalAtom";
import { IoSparkles } from "react-icons/io5";

const NavUserMenu = ({ user }) => {
  const toast = useToast();
  const setAuthModalState = useSetRecoilState(authModalState);

  const handleLogout = () => {
    if (user) {
      signOut(auth)
        .then(() => {
          showToast(toast, "Logged out successfully", "", "success");
        })
        .catch((error) => {
          showToast(toast, "Error logging out", error.message, "error");
        });
    }
  };
  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        padding="1px 5px"
        borderRadius={4}
        _hover={{
          outline: "1px solid ",
          outlineColor: "gray.300",
        }}
      >
        <Flex align="center">
          <Flex align="center">
            {user ? (
              <>
               <Image src={user?.photoURL} borderRadius="50%" mr={2}
                 width={{base: '30px', md:"30px"}}/>
                <Flex
                  direction="column"
                  display={{ base: "none", lg: "flex" }}
                  fontSize="8pt"
                  align="flex-start"
                  mr={4}
                >
                  <Text fontWeight={600}>{user?.displayName}</Text>
                  <Flex>
                    <Icon as={IoSparkles} mr={1} color="brand.100" />
                    <Text color="gray.400">1 Karma</Text>
                  </Flex>
                </Flex>
              </>
            ) : (
              <Icon as={VscAccount} color="gray.400" fontSize={24} mr={1} />
            )}
          </Flex>
          <ChevronDownIcon mr={1} />
        </Flex>
      </MenuButton>
      <MenuList>
        {user ? (
          <>
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
            >
              <Flex align="center">
                <Icon fontSize={18} mr={2} as={CgProfile} />
                Profile
              </Flex>
            </MenuItem>
            <MenuDivider />
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              onClick={handleLogout}
            >
              <Flex align="center">
                <Icon fontSize={18} mr={2} as={MdOutlineLogin} />
                Log Out
              </Flex>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem
              fontSize="1rem"
              fontWeight={800}
              _hover={{
                bg: "blue.600",
                color: "white",
              }}
              onClick={() => setAuthModalState({ open: true, view: "login" })}
            >
              <Flex align="center">
                <Icon fontSize={18} mr={2} as={MdOutlineLogin} />
                Log In
              </Flex>
            </MenuItem>
          </>
        )}
      </MenuList>
    </Menu>
  );
};

export default NavUserMenu;
