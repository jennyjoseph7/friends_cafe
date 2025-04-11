"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react"
import Image from "next/image"
import { menuData } from "@/data/menu-data"
import { useCart } from "../hooks/use-cart"

// Define types for menu items
interface MenuItem {
  name: string;
  price: string | { small: string; medium: string; large: string };
  isVeg: boolean;
  description?: string;
  image: string;
  isSpicy?: boolean;
}

interface MenuCategoryProps {
  category: string;
  items: MenuItem[] | Record<string, MenuItem[]>;
}

interface MenuItemProps {
  item: MenuItem;
  category?: string;
}

export function Menu() {
  const { totalPrice, isFreeDelivery } = useCart()
  
  return (
    <section id="menu" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-4">Our Menu</h2>
        <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore our wide variety of delicious dishes, from breakfast favorites to mouthwatering main courses, pizzas,
          and refreshing beverages.
        </p>
        
        {/* Delivery Fee Banner */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-8 max-w-2xl mx-auto">
          <p className="text-center text-sm">
            {isFreeDelivery ? (
              <span className="text-green-600 font-medium">You qualify for free delivery!</span>
            ) : (
              <span className="text-red-600">
                Free delivery on orders above ₹300 - Add items worth ₹{Math.max(0, (300 - totalPrice)).toFixed(2)} more to qualify
              </span>
            )}
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">Pizza orders include a ₹10 box fee per pizza item</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="inline-flex min-w-max">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
              <TabsTrigger value="noodles">Noodles</TabsTrigger>
              <TabsTrigger value="chinese">Chinese</TabsTrigger>
              <TabsTrigger value="rice">Rice Bowl</TabsTrigger>
              <TabsTrigger value="main">Main Course</TabsTrigger>
              <TabsTrigger value="paneer">Paneer Special</TabsTrigger>
              <TabsTrigger value="pizza">Pizza</TabsTrigger>
              <TabsTrigger value="pasta">Pasta</TabsTrigger>
              <TabsTrigger value="sandwich">Sandwich</TabsTrigger>
              <TabsTrigger value="burger">Burger</TabsTrigger>
              <TabsTrigger value="beverages">Beverages</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-8">
            {Object.entries(menuData).map(([category, items]) => (
              <MenuCategory key={category} category={category} items={items} />
            ))}
          </TabsContent>

          {Object.entries(menuData).map(([category, items]) => (
            <TabsContent key={category} value={category.toLowerCase()} className="space-y-8">
              <MenuCategory category={category} items={items} />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-gray-600 italic">* Veg. & Non-Veg. Thali Available</p>
          <p className="text-gray-600 italic">* All prices are inclusive of taxes</p>
          <p className="text-gray-600 italic">* Didn't Get Bill For Your Food? Have It For Free</p>
        </div>
      </div>
    </section>
  )
}

function MenuCategory({ category, items }: MenuCategoryProps) {
  // Special handling for Pizza category which has subcategories
  if (category === "Pizza" && typeof items === "object" && !Array.isArray(items)) {
    return (
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-red-600 mb-6 pb-2 border-b border-red-200">{category}</h3>
        {Object.entries(items).map(([subCategory, subItems]) => (
          <div key={subCategory} className="mb-8">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">{subCategory}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.isArray(subItems) && subItems.map((item, index) => (
                <MenuItemComponent key={`${subCategory}-${item.name}-${index}`} item={item} category="Pizza" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-red-600 mb-6 pb-2 border-b border-red-200">{category}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.isArray(items) && items.map((item, index) => (
          <MenuItemComponent key={`${category}-${item.name}-${index}`} item={item} category={category} />
        ))}
      </div>
    </div>
  )
}

function MenuItemComponent({ item, category }: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(0)
  const [selectedSize, setSelectedSize] = useState<'small' | 'medium' | 'large'>(
    typeof item.price === 'object' ? 'small' : 'small'
  )
  const { addToCart } = useCart()
  
  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }
  
  const handleDecrement = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0))
  }
  
  // Handle price display for items with size variants (like pizzas)
  const renderPrice = () => {
    if (typeof item.price === 'object' && item.price !== null) {
      return (
        <div className="text-sm space-y-1">
          <div className="flex gap-2">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="small" 
                checked={selectedSize === 'small'}
                onChange={() => setSelectedSize('small')}
                className="mr-1"
              />
              <span className="text-red-600 font-bold">₹{item.price.small} <span className="text-xs">S</span></span>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="medium" 
                checked={selectedSize === 'medium'}
                onChange={() => setSelectedSize('medium')}
                className="mr-1"
              />
              <span className="text-red-600 font-bold">₹{item.price.medium} <span className="text-xs">M</span></span>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex items-center">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="large" 
                checked={selectedSize === 'large'}
                onChange={() => setSelectedSize('large')}
                className="mr-1"
              />
              <span className="text-red-600 font-bold">₹{item.price.large} <span className="text-xs">L</span></span>
            </label>
          </div>
        </div>
      );
    }
    return <p className="text-red-600 font-bold">₹{item.price}</p>;
  }
  
  const getCurrentPrice = (): number => {
    if (typeof item.price === 'object' && item.price !== null) {
      return parseInt(item.price[selectedSize], 10);
    }
    return parseInt(item.price, 10);
  }
  
  const handleAddToCart = () => {
    if (quantity > 0) {
      const itemId = typeof item.price === 'object' 
        ? `${item.name}-${selectedSize}` 
        : item.name;
        
      const cartItem = {
        id: itemId,
        name: item.name,
        price: getCurrentPrice(),
        image: `/placeholder.svg?height=300&width=400&text=${encodeURIComponent(item.name)}`,
        quantity,
        size: typeof item.price === 'object' ? selectedSize : undefined,
        isVeg: item.isVeg,
        category
      };
      
      addToCart(cartItem);
      setQuantity(0);
    }
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={`/placeholder.svg?height=300&width=400&text=${encodeURIComponent(item.name)}`}
          alt={item.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {item.isVeg !== undefined && (
          <div className="absolute top-2 right-2">
            <Badge className={item.isVeg ? "bg-green-600" : "bg-red-600"}>{item.isVeg ? "Veg" : "Non-Veg"}</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2 pt-4">
        <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
      </CardHeader>
      <CardContent className="pb-2">
        {item.description && <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="flex justify-between items-center w-full">
          {renderPrice()}
          {item.isSpicy && (
            <Badge variant="outline" className="border-orange-500 text-orange-500">
              Spicy
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Button 
              type="button"
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={(e) => {
                e.preventDefault();
                handleDecrement();
              }}
              disabled={quantity === 0}
            >
              <MinusIcon className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button 
              type="button"
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full" 
              onClick={(e) => {
                e.preventDefault();
                handleIncrement();
              }}
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          
          {quantity > 0 && (
            <Button 
              type="button"
              variant="default" 
              size="sm" 
              className="bg-red-600 hover:bg-red-700"
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart();
              }}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
