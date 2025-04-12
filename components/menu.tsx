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
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'non-veg'>('all')
  
  // Function to filter menu items based on diet preference
  const filterMenuItems = (items: MenuItem[] | Record<string, MenuItem[]>): MenuItem[] | Record<string, MenuItem[]> => {
    if (dietFilter === 'all') return items
    
    if (Array.isArray(items)) {
      return items.filter(item => 
        dietFilter === 'veg' ? item.isVeg : !item.isVeg
      )
    } else if (typeof items === 'object') {
      const filteredObject: Record<string, MenuItem[]> = {}
      
      Object.entries(items).forEach(([key, subItems]) => {
        if (Array.isArray(subItems)) {
          const filtered = subItems.filter(item => 
            dietFilter === 'veg' ? item.isVeg : !item.isVeg
          )
          if (filtered.length > 0) {
            filteredObject[key] = filtered
          }
        }
      })
      
      return filteredObject
    }
    
    return items
  }
  
  return (
    <section id="menu" className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-red-600 mb-4 relative inline-block">
            Our Menu
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-red-600 rounded-full"></span>
          </h2>
          <p className="text-center text-gray-600 mt-6 max-w-2xl mx-auto">
            Explore our wide variety of delicious dishes, from breakfast favorites to mouthwatering main courses, pizzas,
            and refreshing beverages.
          </p>
        </div>
        
        {/* Diet Filter */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white rounded-full p-1.5 shadow-md flex justify-between">
            <button 
              onClick={() => setDietFilter('all')} 
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                dietFilter === 'all' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Items
            </button>
            <button 
              onClick={() => setDietFilter('veg')} 
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center ${
                dietFilter === 'veg' 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2 border border-white"></span>
              Vegetarian
            </button>
            <button 
              onClick={() => setDietFilter('non-veg')} 
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center ${
                dietFilter === 'non-veg' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2 border border-white"></span>
              Non-Vegetarian
            </button>
          </div>
        </div>
        
        {/* Delivery Fee Banner */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-xl p-4 mb-10 max-w-2xl mx-auto shadow-sm">
          <p className="text-center font-medium">
            {isFreeDelivery ? (
              <span className="text-green-600">✨ You qualify for free delivery! ✨</span>
            ) : (
              <span className="text-red-600">
                Free delivery on orders above ₹300 - Add items worth ₹{Math.max(0, (300 - totalPrice)).toFixed(2)} more to qualify
              </span>
            )}
          </p>
          <p className="text-center text-xs text-gray-500 mt-1">Pizza orders include a ₹10 box fee per pizza item</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="mb-10 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">
            <TabsList className="inline-flex min-w-max rounded-full bg-gray-100 p-1 shadow-sm">
              <TabsTrigger value="all" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">All Items</TabsTrigger>
              <TabsTrigger value="breakfast" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Breakfast</TabsTrigger>
              <TabsTrigger value="noodles" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Noodles</TabsTrigger>
              <TabsTrigger value="chinese" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Chinese</TabsTrigger>
              <TabsTrigger value="fried rice bowl" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Fried Rice</TabsTrigger>
              <TabsTrigger value="rice bowl" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Rice Bowl</TabsTrigger>
              <TabsTrigger value="main course" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Main Course</TabsTrigger>
              <TabsTrigger value="non-veg main course" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Non-Veg</TabsTrigger>
              <TabsTrigger value="paneer special" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Paneer</TabsTrigger>
              <TabsTrigger value="tandoori snacks" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Tandoori</TabsTrigger>
              <TabsTrigger value="maggi" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Maggi</TabsTrigger>
              <TabsTrigger value="tawa se" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Roti</TabsTrigger>
              <TabsTrigger value="salad & raita" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Salad & Raita</TabsTrigger>
              <TabsTrigger value="single pizza" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Single Pizza</TabsTrigger>
              <TabsTrigger value="double pizza" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Double Pizza</TabsTrigger>
              <TabsTrigger value="pizza" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Size Pizza</TabsTrigger>
              <TabsTrigger value="pasta" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Pasta</TabsTrigger>
              <TabsTrigger value="grilled sandwich" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Sandwich</TabsTrigger>
              <TabsTrigger value="burger" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Burger</TabsTrigger>
              <TabsTrigger value="wraps" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Wraps</TabsTrigger>
              <TabsTrigger value="fries" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Fries</TabsTrigger>
              <TabsTrigger value="garlic bread" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Garlic Bread</TabsTrigger>
              <TabsTrigger value="american fry" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">American Fry</TabsTrigger>
              <TabsTrigger value="fish" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Fish</TabsTrigger>
              <TabsTrigger value="shakes" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Shakes</TabsTrigger>
              <TabsTrigger value="mocktails" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Mocktails</TabsTrigger>
              <TabsTrigger value="special combo pack" className="rounded-full px-4 py-2 data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all">Combo Pack</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="space-y-12">
            {Object.entries(menuData).map(([category, items]) => {
              const filteredItems = filterMenuItems(items)
              
              // Skip rendering if no items match the filter
              if (
                (Array.isArray(filteredItems) && filteredItems.length === 0) || 
                (typeof filteredItems === 'object' && !Array.isArray(filteredItems) && Object.keys(filteredItems).length === 0)
              ) {
                return null
              }
              
              return (
                <MenuCategory key={category} category={category} items={filteredItems} />
              )
            })}
          </TabsContent>

          {Object.entries(menuData).map(([category, items]) => {
            const filteredItems = filterMenuItems(items)
            
            // Skip rendering TabsContent if no items match the filter
            if (
              (Array.isArray(filteredItems) && filteredItems.length === 0) || 
              (typeof filteredItems === 'object' && !Array.isArray(filteredItems) && Object.keys(filteredItems).length === 0)
            ) {
              return null
            }
            
            return (
              <TabsContent key={category} value={category.toLowerCase()} className="space-y-12">
                <MenuCategory category={category} items={filteredItems} />
              </TabsContent>
            )
          })}
        </Tabs>

        <div className="mt-16 text-center bg-white rounded-xl py-6 px-4 shadow-sm border border-gray-100">
          <p className="text-gray-600 italic mb-2">* Veg. & Non-Veg. Thali Available</p>
          <p className="text-gray-600 italic mb-2">* All prices are inclusive of taxes</p>
          <p className="text-gray-600 italic font-medium text-red-600">* Didn't Get Bill For Your Food? Have It For Free</p>
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
        <div className="flex items-center mb-8">
          <h3 className="text-2xl font-bold text-red-600 relative">
            {category}
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-red-600/30 rounded-full"></span>
          </h3>
          <div className="h-px bg-gradient-to-r from-red-200 to-transparent flex-grow ml-4"></div>
        </div>
        {Object.entries(items).map(([subCategory, subItems]) => (
          <div key={subCategory} className="mb-10">
            <h4 className="text-xl font-semibold text-gray-800 mb-6 pl-4 border-l-4 border-red-400">{subCategory}</h4>
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
      <div className="flex items-center mb-8">
        <h3 className="text-2xl font-bold text-red-600 relative">
          {category}
          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-red-600/30 rounded-full"></span>
        </h3>
        <div className="h-px bg-gradient-to-r from-red-200 to-transparent flex-grow ml-4"></div>
      </div>
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
        <div className="text-sm space-y-2">
          <div className="flex gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="small" 
                checked={selectedSize === 'small'}
                onChange={() => setSelectedSize('small')}
                className="mr-1 accent-red-600"
              />
              <span className="text-red-600 font-bold text-base">₹{item.price.small} <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded-md ml-1">Small</span></span>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="medium" 
                checked={selectedSize === 'medium'}
                onChange={() => setSelectedSize('medium')}
                className="mr-1 accent-red-600"
              />
              <span className="text-red-600 font-bold text-base">₹{item.price.medium} <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded-md ml-1">Medium</span></span>
            </label>
          </div>
          <div className="flex gap-2">
            <label className="inline-flex items-center cursor-pointer">
              <input 
                type="radio" 
                name={`size-${item.name}`} 
                value="large" 
                checked={selectedSize === 'large'}
                onChange={() => setSelectedSize('large')}
                className="mr-1 accent-red-600"
              />
              <span className="text-red-600 font-bold text-base">₹{item.price.large} <span className="text-xs bg-red-100 px-1.5 py-0.5 rounded-md ml-1">Large</span></span>
            </label>
          </div>
        </div>
      );
    }
    return <p className="text-red-600 font-bold text-lg">₹{item.price}</p>;
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
        image: item.image,
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
      className="overflow-hidden transition-all duration-300 hover:shadow-xl rounded-xl border-0 shadow-lg bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={`object-contain transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-transparent opacity-50"></div>
        <div className="absolute top-3 right-3 flex gap-2">
          {item.isVeg !== undefined && (
            <Badge className={`text-xs font-medium ${item.isVeg ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
              {item.isVeg ? "Veg" : "Non-Veg"}
            </Badge>
          )}
          {item.isSpicy && (
            <Badge className="bg-orange-500 hover:bg-orange-600 text-xs font-medium">
              Spicy
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="pb-1 pt-4">
        <h4 className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</h4>
      </CardHeader>
      <CardContent className="pb-1">
        {item.description && <p className="text-gray-600 text-sm line-clamp-2 h-10">{item.description}</p>}
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 pt-1 pb-4">
        <div className="flex justify-between items-center w-full">
          {renderPrice()}
        </div>
        
        <div className="flex items-center justify-between w-full mt-3">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button 
              type="button"
              className="flex items-center justify-center h-8 w-8 rounded-full text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors" 
              onClick={handleDecrement}
              disabled={quantity === 0}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-semibold text-gray-900">{quantity}</span>
            <button 
              type="button"
              className="flex items-center justify-center h-8 w-8 rounded-full text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors" 
              onClick={handleIncrement}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          
          {quantity > 0 && (
            <Button 
              type="button"
              variant="default" 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 rounded-full px-4 transition-transform hover:scale-105"
              onClick={handleAddToCart}
            >
              <ShoppingCartIcon className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
